/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import Request from './Request';
import Response from './Response';
declare class Context {
    request: Request;
    response: Response;
    req: IncomingMessage;
    res: ServerResponse;
    constructor(request: Request, response: Response);
    readonly query: import("querystring").ParsedUrlQuery;
    body: string | undefined;
    status: number;
}
export default Context;
