const createError = require('http-errors');

/**
 * Context Prototype.
 */
const context = {
  get query(): string {
    return this.request.query;
  },
  get body(): string {
    return this.response.body;
  },
  set body(data: string) {
    this.response.body = data;
  },

  get status(): string {
    return this.response.status;
  },

  set status(statusCode) {
    this.response.status = statusCode;
  },

  /**
   * Return JSON Representation.
   */
  toJSON(): object {
    return {
      request: this.request.toJSON(),
      response: this.response.toJSON(),
      app: this.app.toJSON(),
      originalUrl: this.originalUrl,
      req: '<original node req>',
      res: '<original node res>',
      socket: '<original node socket>'
    };
  },

  /**
   * Create and Throw http errors to user level
   * @param {*} args 
   * @api public
   */
  throw(...args: Array<any>): void {
    throw createError(...args)
  },
};

export default context;
