import Context from './Context';
/**
 * The type definition of middleware function
 */
export declare type Middleware = (context: Context, next: () => Promise<any>) => any;
export declare type ComposedMiddleware = (context: Context, next?: () => Promise<any>) => Promise<void>;
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
export declare const createNext: (ctx: Context, middleware: Middleware, oldNext: () => Promise<any>) => () => Promise<void>;
