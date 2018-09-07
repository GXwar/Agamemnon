let http = require('http');
let EventEmitter = require('events');

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

  listen(...args) {
    let server = http.createServer(this.callback());
    server.listen(...args);
  }

  /**
   * Load middleware
   * @param {function} middleware 
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }
  
  /**
   * Compose middlewares into one middleware
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

  /**
   * Generate the callback for the http server
   */
  callback() {
    // req & res is node's request and response objects
    return (req, res) => {
      let ctx = this.createContext(req, res);
      let respond = () => this.responseBody(ctx);
      let onerror = (err) => this.onerror(err, ctx);
      let fn = this.compose();
      return fn(ctx)
                .then(respond)
                .catch(onerror);
    };
  }

  /**
   * Construct context which encapsulates node's request and response objects
   * @param {object} req
   * @param {object} res
   */
  createContext(req, res) {
    let ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
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
