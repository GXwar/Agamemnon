import { IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';
import url from 'url';

export interface IRequest {
  req: any;
  readonly query: string | ParsedUrlQuery;
}

export const request: IRequest = {
  req: undefined,
  get query() {
    if (this.req) {
      return url.parse(this.req.url as string, true).query;
    } else {
      throw new Error('This is no request object');
    }
  }
}
