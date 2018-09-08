/**
 * Context Prototype.
 */
const context = {
  get query() {
    return this.request.query;
  },
  get body() {
    return this.response.body;
  },
  set body(data) {
    this.response.body = data;
  },

  get status() {
    return this.response.status;
  },

  set status(statusCode) {
    this.response.status = statusCode;
  },

  /**
   * Return JSON Representation.
   */
  toJSON() {
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
};

