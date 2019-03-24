import { ServerResponse } from 'http';

export interface IResponse {
  res: any;
  _body: string;
  body: string;
  status: number;
}

export const response: IResponse = {
  res: undefined,
  _body: '',
  get body() {
    return this._body;
  },
  /**
   * Set the body content returned to client
   */
  set body(data: string) {
    this._body = data;
  },

  get status() {
    if(this.res) return this.res.statusCode;
    else return -1;
  },
  /**
   * Set the statusCode returned to client
   */
  set status(statusCode: number) {
    if (this.res) this.res.statusCode = statusCode;
  }
};
