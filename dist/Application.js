"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var http_1 = __importDefault(require("http"));
var Context_1 = __importDefault(require("./Context"));
var Request_1 = __importDefault(require("./Request"));
var Response_1 = __importDefault(require("./Response"));
var Utils_1 = require("./Utils");
var Application = /** @class */ (function (_super) {
    __extends(Application, _super);
    function Application() {
        var _this = _super.call(this) || this;
        _this.middlewares = [];
        return _this;
    }
    /******************** user functions ********************/
    /**
     * Start http server, and get callback function
     */
    Application.prototype.listen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var composedFn = this.callback();
        var server = http_1.default.createServer(composedFn);
        return server.listen.apply(server, args);
    };
    /**
     * Mount callback function
     */
    Application.prototype.use = function (middleware) {
        this.middlewares.push(middleware);
    };
    /******************** internal functions ********************/
    /**
     * Get callback function for http server
     */
    Application.prototype.callback = function () {
        var _this = this;
        return function (req, res) {
            var ctx = _this.createContext(req, res);
            var fn = _this.compose();
            fn(ctx).then(function () {
                _this.responseBody(ctx);
            }).catch(function (err) {
                _this.onerror(err, ctx);
            });
        };
    };
    /**
     * Build context object
     */
    Application.prototype.createContext = function (req, res) {
        var request = new Request_1.default(req);
        var response = new Response_1.default(res);
        var ctx = new Context_1.default(request, response);
        return ctx;
    };
    /**
     * Compose all middlewares to one middleware
     */
    Application.prototype.compose = function () {
        var _this = this;
        return function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            var next, len, i, currendMiddleware;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, Promise.resolve()];
                        }); }); };
                        len = this.middlewares.length;
                        for (i = len - 1; i >= 0; i--) {
                            currendMiddleware = this.middlewares[i];
                            next = Utils_1.createNext(ctx, currendMiddleware, next);
                        }
                        return [4 /*yield*/, next()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
    };
    /**
     * Response to client
     */
    Application.prototype.responseBody = function (ctx) {
        var content = ctx.body;
        if (ctx.res && typeof content === 'string') {
            ctx.res.end(content);
        }
        else if (ctx.res && typeof content === 'object') {
            ctx.res.end(JSON.stringify(content));
        }
    };
    /**
     * Error Handle
     */
    Application.prototype.onerror = function (err, ctx) {
        if (err.code === 'ENOENT') {
            ctx.status = 404;
        }
        else {
            ctx.status = 500;
        }
        var msg = err.message || 'Internal Error';
        ctx.res.end(msg);
        this.emit('error', err);
    };
    return Application;
}(events_1.EventEmitter));
exports.default = Application;
