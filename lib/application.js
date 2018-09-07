let http = require('http');

let context = require('./context');
let request = require('./request');
let response = require('./response');

class Application {
  constructor() {
    this.callbackFunc;
    this.context = context;
    this.request = request;
    this.response = response;
  }

  listen(...args) {
    let server = http.createServer(this.callback());
    server.listen(...args);
  }

  // Load callback function
  use(fn) {
    this.callbackFunc = fn;
  }

  // Generate the callback for the http server
  callback() {
    // req & res is node's request and response objects
    return (req, res) => {
      let ctx = this.createContext(req, res);
      let respond = () => this.responseBody(ctx);
      this.callbackFunc(ctx).then(respond);
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
    ctx.res = ctx.request.res = res;
    return ctx;
  }

  // Response to client
  responseBody(ctx) {
    let context = ctx.body;
    if (typeof content === 'string') {
      ctx.res.end(content);
    }
    else if (typeof content === 'object') {
      ctx.res.end(JSON.stringify(content));
    }
  }
}

module.exports = Application;
