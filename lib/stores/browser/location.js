"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("svelte/store");
var location_1 = require("../../util/browser/location");
var context_1 = require("../../util/shared/context");
var util_1 = require("../../util");
/**
 * Returns the standardized defaults for options passed into `pathname` Store
 * @param options
 */
function PathnameOptions(options) {
    if (options === void 0) { options = {}; }
    return __assign({ hash: false, push_state: true }, options);
}
/**
 * Returns the standardized defaults for options passed into `query_param` Store
 * @param options
 */
function QueryParamOptions(options) {
    if (options === void 0) { options = {}; }
    return __assign({ hash: false }, options);
}
/**
 * Returns a `Readable` (Server) / `Writable` (Browser) Svelte Store for listening / modifying `location.hash`
 *
 * NOTE: For convenience, values read / written already have their prefixing "#" removed / added respectively
 *
 * ```javascript
 * TODO:
 * ```
 */
function hash() {
    var url = location_1.get_url();
    if (!context_1.CONTEXT_IS_BROWSER)
        return store_1.readable(url.hash, function () { });
    var store = store_1.writable(url.hash, function (set) {
        function on_hash_change() {
            set(location.hash ? location.hash.slice(1) : "");
        }
        set(location.hash ? location.hash.slice(1) : "");
        window.addEventListener("hashchange", on_hash_change);
        return function () {
            window.removeEventListener("hashchange", on_hash_change);
        };
    });
    store.subscribe(function (value) {
        location.hash = "#" + value;
    });
    return store;
}
exports.hash = hash;
/**
 * Returns a `Readable` (Server) / `Writable` (Browser) Svelte Store with a reactive binding to current pathname
 *
 * NOTE: Set `options.hash` to `true` for hash-based routing systems
 *
 * ```javascript
 * TODO:
 * ```
 *
 * @param options
 */
function pathname(options) {
    if (options === void 0) { options = {}; }
    var _a = PathnameOptions(options), hash = _a.hash, push_state = _a.push_state;
    var _pathname = location_1.get_url(hash).pathname;
    if (!context_1.CONTEXT_IS_BROWSER)
        return store_1.readable(_pathname, function () { });
    var event_name = hash ? "hashchange" : "popstate";
    var store = store_1.writable(_pathname, function (set) {
        function on_url_change() {
            var pathname = location_1.get_url(hash).pathname;
            _pathname = pathname;
            set(pathname);
        }
        // Need to make sure we're always fresh, whenever we initialize again
        on_url_change();
        window.addEventListener(event_name, on_url_change);
        return function () {
            window.removeEventListener(event_name, on_url_change);
        };
    });
    store.subscribe(function (value) {
        var url = new URL(value, location.origin);
        // We want to make sure that we don't update the Browser history
        // on our initial value or window events
        if (_pathname !== url.pathname)
            location_1.update_url(url, hash, push_state);
    });
    return store;
}
exports.pathname = pathname;
/**
 * Returns a `Readable` Svelte Store, which returns the assigned Svelte Component to the
 * current pathname.
 *
 * NOTE: Set `options.hash` to `true` for hash-based routing systems
 *
 * ```javascript
 * TODO:
 * ```
 *
 * @param routes
 * @param options
 */
function router(routes, options) {
    if (options === void 0) { options = {}; }
    var router = util_1.make_router(routes);
    var store = pathname(options);
    return store_1.readable(null, function (set) {
        function on_pathname(pathname) {
            var results = router(pathname);
            if (results)
                set({ Component: results[1], parameters: results[0] });
            else
                set(null);
        }
        var unsubscribe = store.subscribe(on_pathname);
        return function () {
            unsubscribe();
        };
    });
}
exports.router = router;
/**
 * Returns a `Readable` (Server) / `Writable` (Browser) Svelte Store with a reactive binding to the given Query Parameter
 *
 * NOTE: Set `options.hash` to `true` for hash-based routing systems
 * NOTE: When setting value to `undefined` / `""` / `false` or the `default_value`, it will be deleted from the query string instead
 *
 * ```javascript
 * TODO:
 * ```
 *
 * @param key
 * @param default_value
 * @param options
 */
function query_param(key, default_value, options) {
    if (default_value === void 0) { default_value = ""; }
    if (options === void 0) { options = {}; }
    var hash = QueryParamOptions(options).hash;
    var params = location_1.get_query_params(hash);
    var stored_value = typeof params[key] !== "undefined" ? params[key] : default_value;
    if (!context_1.CONTEXT_IS_BROWSER)
        return store_1.readable(stored_value, function () { });
    var store = store_1.writable(stored_value);
    store.subscribe(function (value) {
        var _a, _b;
        if (value === default_value)
            location_1.update_query_params((_a = {}, _a[key] = undefined, _a), hash);
        else
            location_1.update_query_params((_b = {}, _b[key] = value, _b), hash);
    });
    return store;
}
exports.query_param = query_param;
//# sourceMappingURL=location.js.map