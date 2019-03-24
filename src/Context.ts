import {
  IncomingMessage,
  ServerResponse
} from 'http';
import { ParsedUrlQuery } from 'querystring';

import { request, IRequest } from './request';
import { response, IResponse } from './response';
import { Socket } from 'dgram';

export interface IContext {
  request: IRequest;
  response: IResponse;
  req: any;
  res: any;
  query: string | ParsedUrlQuery;
  body: string;
  status: number;
  [key: string]: any;
}

export const context: IContext = {
  request: request,
  response: response,
  req: undefined,
  res: undefined,
  get query() {
    if (this.request) return this.request.query;
    else return '';
  },
  get body() {
    if (this.response) return this.response.body;
    else return '';
  },
  set body(data: string) {
    if (this.response) this.response.body = data;
  },
  get status() {
    if (this.response) return this.response.status;
    else return -1;
  },
  set status(statusCode: number) {
    if (this.response) this.response.status = statusCode;
  }
}
