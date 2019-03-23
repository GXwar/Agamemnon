import { EventEmitter } from 'events';
import http from 'http';
import { 
  IncomingMessage, 
  ServerResponse, 
  Server,
  RequestListener
} from 'http';

import { Context } from './Context';
import { Request } from './Request';
import { Response } from './Response';
import {
  Middleware,
  ComposedMiddleware,
  createNext,
  ErrnoException
} from './Utils';

class Application extends EventEmitter {
  // Attributes
  private middlewares: Array<Middleware>;

  constructor() {
    super();
    this.middlewares = [];
  }

  /******************** user functions ********************/
  /**
   * Start http server, and get callback function
   */
  listen(...args: Array<any>): Server {
    const composedFn: RequestListener = this.callback();
    const server: Server = http.createServer(composedFn);
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
  private createContext(req: IncomingMessage, res: ServerResponse): Context {
    const request = new Request(req);
    const response = new Response(res);
    const ctx = new Context(request, response);
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
  private responseBody(ctx: Context) {
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
  onerror(err: ErrnoException, ctx: Context) {
    if (err.code === 'ENOENT') {
      ctx.status = 404;
    } else {
      ctx.status = 500;
    }
    const msg = err.message || 'Internal Error';
    ctx.res.end(msg);
    this.emit('error', err);
  }
}

export default Application;
