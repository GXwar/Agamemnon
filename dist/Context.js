"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Context = /** @class */ (function () {
    function Context(request, response) {
        this.request = request;
        this.response = response;
        this.req = request.req;
        this.res = response.res;
    }
    Object.defineProperty(Context.prototype, "query", {
        get: function () {
            console.log(this.request.query);
            return this.request.query;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "body", {
        get: function () {
            return this.response.body;
        },
        set: function (data) {
            this.response.body = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "status", {
        get: function () {
            return this.response.status;
        },
        set: function (statusCode) {
            this.response.status = statusCode;
        },
        enumerable: true,
        configurable: true
    });
    return Context;
}());
exports.default = Context;
