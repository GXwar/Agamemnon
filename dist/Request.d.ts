/// <reference types="node" />
import { IncomingMessage } from 'http';
declare class Request {
    req: IncomingMessage;
    constructor(req: IncomingMessage);
    readonly query: import("querystring").ParsedUrlQuery;
}
export default Request;
