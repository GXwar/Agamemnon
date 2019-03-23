"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = __importDefault(require("url"));
var Request = /** @class */ (function () {
    function Request(req) {
        this.req = req;
    }
    Object.defineProperty(Request.prototype, "query", {
        get: function () {
            return url_1.default.parse(this.req.url, true).query;
        },
        enumerable: true,
        configurable: true
    });
    return Request;
}());
exports.default = Request;
