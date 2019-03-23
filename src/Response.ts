import { ServerResponse } from 'http';

export class Response {
  res: ServerResponse;
  private _body: string | undefined;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  get body(): string | undefined {
    return this._body;
  }
  /**
   * Set the body content returned to client
   */
  set body(data: string | undefined) {
    this._body = data;
  }

  get status() {
    return this.res.statusCode;
  }
  /**
   * Set the statusCode returned to client
   */
  set status(statusCode: number) {
    this.res.statusCode = statusCode;
  }
}
