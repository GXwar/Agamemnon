"use strict";
var url = require('url');
var parse = require('parseurl');
/**
 * Request Prototype
 */
module.exports = {
    /**
     * Return request header.
     *
     * @return {Object}
     * @api public
     */
    get header() {
        return this.req.headers;
    },
    /**
     * Set request header.
     *
     * @api public
     */
    set header(val) {
        this.req.headers = val;
    },
    /**
     * Return request header, alias as request.header.
     *
     * @return {Object}
     * @api public
     */
    get headers() {
        return this.req.headers;
    },
    /**
     * Set request header, alias as request.header.
     *
     * @api public
     */
    set headers(val) {
        this.req.headers = val;
    },
    /**
     * Get request URL.
     *
     * @return {String}
     * @api public
     */
    get url() {
        return this.req.url;
    },
    /**
     * Set request URL.
     *
     * @api public
     */
    set url(val) {
        this.req.url = val;
    },
    /**
     * Get origin of URL.
     *
     * @return {String}
     * @api public
     */
    get origin() {
        return this.protocol + "://" + this.host;
    },
    /**
     * Get full request URL.
     *
     * @return {String}
     * @api public
     */
    get href() {
        // support: `GET http://example.com/foo`
        if (/^https?:\/\//i.test(this.originalUrl))
            return this.originalUrl;
        return this.origin + this.originalUrl;
    },
    /**
     * Get request method.
     *
     * @return {String}
     * @api public
     */
    get method() {
        return this.req.method;
    },
    /**
     * Set request method.
     *
     * @param {String} val
     * @api public
     */
    set method(val) {
        this.req.method = val;
    },
    /**
     * Get request pathname.
     *
     * @return {String}
     * @api public
     */
    get path() {
        return parse(this.req).pathname;
    },
    /**
     * Set pathname, retaining the query-string when present.
     *
     * @param {String} path
     * @api public
     */
    set path(path) {
        var url = parse(this.req);
        if (url.pathname === path)
            return;
        url.pathname = path;
        url.path = null;
        this.url = stringify(url);
    },
    get query() {
        return url.parse(this.req.url, true).query;
    }
};
