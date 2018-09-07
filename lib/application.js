let http = require('http');

class Application {
  constructor() {
    this.callbackFunc;
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
    return (req, res) => {
      this.callbackFunc(req, res);
    };
  }
}

module.exports = Application;
