import http from 'http';
import { 
  IncomingMessage, 
  ServerResponse, 
  Server,
  RequestListener
} from 'http';

import Context from './Context';
import Request from './Request';
import Response from './Response';
import {
  Middleware,
  ComposedMiddleware,
  createNext
} from './Utils';

class Application {
  // Attributes
  middlewares: Array<Middleware>;
  context: Context | undefined;
  request: Request | undefined;
  response: Response | undefined;

  constructor() {
    this.middlewares = [];
  }

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

  /**
   * Compose all middlewares to one middleware
   */
  compose(): ComposedMiddleware {
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
   * Callback function for createServer
   */
  callback(): RequestListener {
    return (req: IncomingMessage, res: ServerResponse) => {
      const ctx = this.createContext(req, res);
      const fn = this.compose();
      fn(ctx).then(() => {
        this.responseBody(ctx);
      });
    }
  }

  /**
   * Build context object
   */
  createContext(req: IncomingMessage, res: ServerResponse): Context {
    const request = new Request(req);
    const response = new Response(res);
    const ctx = new Context(request, response);
    return ctx;
  }

  responseBody(ctx: Context) {
    const content = ctx.body;
    if (ctx.res && typeof content === 'string') {
      ctx.res.end(content);
    } else if (ctx.res && typeof content === 'object') {
      ctx.res.end(JSON.stringify(content));
    }
  }
}

export default Application;
