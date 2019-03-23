import {
  IncomingMessage,
  ServerResponse
} from 'http';

import Request from './Request';
import Response from './Response';

class Context {
  request: Request;
  response: Response;
  req: IncomingMessage;
  res: ServerResponse;

  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
    this.req = request.req;
    this.res = response.res;
  }

  get query() {
    console.log(this.request.query);
    return this.request.query;
  }

  get body() {
      return this.response.body;
  }

  set body(data) {
      this.response.body = data;
  }

  get status() {
      return this.response.status;
  }

  set status(statusCode) {
      this.response.status = statusCode;
  }
}

export default Context;
