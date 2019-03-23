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

type asyncContextFn = (ctx: Context) => Promise<void>;

class Application {
  // Attributes
  callbackFunc: asyncContextFn | undefined;
  context: Context | undefined;
  request: Request | undefined;
  response: Response | undefined;

  listen(...args: Array<any>): Server {
    const composedFn: RequestListener = this.callback();
    const server: Server = http.createServer(composedFn);
    return server.listen(...args);
  }

  /**
   * Mount callback function
   */
  use(fn: asyncContextFn): void {
    this.callbackFunc = fn;
  }

  callback(): RequestListener {
    return (req: IncomingMessage, res: ServerResponse) => {
      const ctx = this.createContext(req, res);
      if (this.callbackFunc) {
        this.callbackFunc(ctx).then(() => {
          this.responseBody(ctx);
        });
      }
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
