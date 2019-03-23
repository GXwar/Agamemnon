/// <reference types="node" />
import { EventEmitter } from 'events';
import { Server } from 'http';
import Context from './Context';
import { Middleware, ErrnoException } from './Utils';
declare class Application extends EventEmitter {
    private middlewares;
    constructor();
    /******************** user functions ********************/
    /**
     * Start http server, and get callback function
     */
    listen(...args: Array<any>): Server;
    /**
     * Mount callback function
     */
    use(middleware: Middleware): void;
    /******************** internal functions ********************/
    /**
     * Get callback function for http server
     */
    private callback;
    /**
     * Build context object
     */
    private createContext;
    /**
     * Compose all middlewares to one middleware
     */
    private compose;
    /**
     * Response to client
     */
    private responseBody;
    /**
     * Error Handle
     */
    onerror(err: ErrnoException, ctx: Context): void;
}
export default Application;
