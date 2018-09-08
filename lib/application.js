const http = require('http');
const EventEmitter = require('events');

const debug = require('debug')('koa:application');
const isGeneratorFunction = require('is-generator-function');
const only = require('only');

let context = require('./context');
let request = require('./request');
let response = require('./response');

class Application extends EventEmitter {
  constructor() {
    super();
    this.middlewares = [];
    this.context = context;
    this.request = request;
    this.response = response;
  }

  /**
   * Shortcut for:
   *    http.createServer(app.callback()).listen(..args)
   * @param {Mixed} args 
   */
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * Return whitelisted properties of an object
   */
  toJSON() {
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env'
    ]);
  }
  
  /**
   * Inspect Implementation
   */
  inspect() {
    return this.toJSON();
  }

  /**
   * Load middleware
   * @param {function} fn 
   * @return {Application} self
   */
  use(fn) {
    if (typeof(fn) !== 'function') throw new TypeError('middleware must be a function');
    if (isGeneratorFunction(fn)) throw new TypeError('middleware could not be a generator function');
    debug('use %s', fn._name || fn.name || '-');
    this.middlewares.push(fn);
    return this;
  }
  
  /**
   * Compose middlewares into one middleware
   * 
   * @api private
   */
  compose() {
    return async ctx => {
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext);
        }
      }

      let len = this.middlewares.length;
      let next = async () => {
        return Promise.resolve();
      };
      for (let i = len - 1; i >= 0; i--) {
        let currentMiddleware = this.middlewares[i];
        next = createNext(currentMiddleware, next);
      }

      await next();
    }
  }

  handleRequest(ctx, fnMiddleware) {
    const respond = () => this.responseBody(ctx);
    const onerror = (err) => this.onerror(err);
    return fnMiddleware(ctx).then(respond).catch(onerror);
  }

  /**
   * Generate the callback for the http server
   */
  callback() {
    // req & res is node's request and response objects
    const fn = this.compose();
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    }
    return handleRequest;
  }

  /**
   * Construct context which encapsulates node's request and response objects
   * @param {object} req
   * @param {object} res
   * 
   * @api private
   */
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  /**
   * Response to client
   * @param {object} ctx 
   */
  responseBody(ctx) {
    let content = ctx.body;
    if (typeof content === 'string') {
      ctx.res.end(content);
    }
    else if (typeof content === 'object') {
      ctx.res.end(JSON.stringify(content));
    }
  }

  /**
   * Default error handler
   * @param {*} err 
   * @param {*} ctx 
   */
  onerror(err, ctx) {
    if (err.code === 'ENOENT') {
      ctx.status = 404;
    } else {
      ctx.status = 500;
    }
    let msg = err.message || 'Internal error';
    ctx.res.end(msg);
    this.emit('error', err);
  }
}

module.exports = Application;
