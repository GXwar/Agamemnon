import Context from './Context';

/**
 * The type definition of middleware function
 */
export type Middleware = (context: Context, next: () => Promise<any>) => any;
export type ComposedMiddleware = (context: Context, next?: () => Promise<any>) => Promise<void>;

/**
 * Compose middleware with oldNext
 * @param ctx current context
 * @param middleware middleware function
 * @param oldNext core part next
 */
export const createNext = (ctx: Context, middleware: Middleware, oldNext: () => Promise<any>) => {
  return async () => {
    await middleware(ctx, oldNext);
  }
}
