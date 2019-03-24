import { EventEmitter } from 'events';
import http from 'http';
import { 
  IncomingMessage, 
  ServerResponse, 
  Server,
  RequestListener
} from 'http';

import { context, IContext } from './context';
import { request, IRequest } from './request';
import { response, IResponse } from './response';
import {
  Middleware,
  ComposedMiddleware,
  createNext,
  ErrnoException
} from './utils';

class Application extends EventEmitter {
  // Attributes
  private middlewares: Array<Middleware>;
  context: IContext;
  request: IRequest;
  response: IResponse;
  server?: Server;

  constructor() {
    super();
    this.middlewares = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  /******************** user functions ********************/
  /**
   * Start http server, and get callback function
   */
  listen(...args: Array<any>): Server {
    const composedFn: RequestListener = this.callback();
    const server: Server = http.createServer(composedFn);
    this.server = server;
    return server.listen(...args);
  }

  /**
   * Mount callback function
   */
  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  /******************** internal functions ********************/
  /**
   * Get callback function for http server
   */
  private callback(): RequestListener {
    return (req: IncomingMessage, res: ServerResponse) => {
      const ctx = this.createContext(req, res);
      this.context = ctx;
      const fn = this.compose();
      fn(ctx).then(() => {
        this.responseBody(ctx);
      }).catch((err) => {
        this.onerror(err, ctx);
      });
    }
  }

  /**
   * Build context object
   */
  private createContext(req: IncomingMessage, res: ServerResponse): IContext {
    const ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }

  /**
   * Compose all middlewares to one middleware
   */
  private compose(): ComposedMiddleware {
    return async ctx => {
      let next = async () => Promise.resolve();
      const len: number = this.middlewares.length;
      for (let i = len - 1; i >= 0; i--) {
        const currendMiddleware = this.middlewares[i];
        next = createNext(ctx, currendMiddleware, next);
      }
      await next();
    }
  }

  /**
   * Response to client
   */
  private responseBody(ctx: IContext) {
    const content = ctx.body;
    if (ctx.res && typeof content === 'string') {
      ctx.res.end(content);
    } else if (ctx.res && typeof content === 'object') {
      ctx.res.end(JSON.stringify(content));
    }
  }

  /**
   * Error Handle
   */
  onerror(err: ErrnoException, ctx: IContext) {
    if (err.code === 'ENOENT') {
      ctx.status = 404;
    } else {
      ctx.status = 500;
    }
    const msg = err.message || 'Internal Error';
    if (ctx.res) ctx.res.end(msg);
    this.emit('error', err);
  }
}

export default Application;
