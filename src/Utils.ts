import { IContext } from './context';

/**
 * The type definition of middleware function
 */
export type Middleware = (context: IContext, next: () => Promise<any>) => any;
export type ComposedMiddleware = (context: IContext, next?: () => Promise<any>) => Promise<void>;

export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}

/**
 * Compose middleware with oldNext
 * @param ctx current context
 * @param middleware middleware function
 * @param oldNext core part next
 */
export const createNext = (ctx: IContext, middleware: Middleware, oldNext: () => Promise<any>) => {
  return async () => {
    await middleware(ctx, oldNext);
  }
}
