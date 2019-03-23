/// <reference types="node" />
import { ServerResponse } from 'http';
declare class Response {
    res: ServerResponse;
    private _body;
    constructor(res: ServerResponse);
    /**
    * Set the body content returned to client
    */
    body: string | undefined;
    /**
    * Set the statusCode returned to client
    */
    status: number;
}
export default Response;
