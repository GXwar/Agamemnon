"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response = /** @class */ (function () {
    function Response(res) {
        this.res = res;
    }
    Object.defineProperty(Response.prototype, "body", {
        get: function () {
            return this._body;
        },
        /**
         * Set the body content returned to client
         */
        set: function (data) {
            this._body = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "status", {
        get: function () {
            return this.res.statusCode;
        },
        /**
         * Set the statusCode returned to client
         */
        set: function (statusCode) {
            this.res.statusCode = statusCode;
        },
        enumerable: true,
        configurable: true
    });
    return Response;
}());
exports.default = Response;
