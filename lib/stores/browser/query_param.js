"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var location_1 = require("../../util/browser/location");
var overlay_1 = require("../shared/overlay");
var location_2 = require("./location");
/**
 * Returns the options passable into the [[query_param]] Svelte Store, with standard defaults
 *
 * @internal
 *
 * @param options
 */
function QueryParamOptions(options) {
    if (options === void 0) { options = {}; }
    var _a = options.hash, hash = _a === void 0 ? false : _a, _b = options.replace, replace = _b === void 0 ? false : _b;
    return { hash: hash, replace: replace };
}
/**
 *
 * @param key
 * @param default_value
 * @param options
 */
function query_param(key, default_value, options) {
    if (options === void 0) { options = {}; }
    var _a = QueryParamOptions(options), hash = _a.hash, replace = _a.replace;
    var store = location_2.search({ hash: hash, replace: replace });
    return overlay_1.overlay(store, 
    // @ts-ignore
    function (value) {
        var params = new URLSearchParams(value);
        // If the end-developer specified that the query parameter was a boolean, only the existance of the key should be returned
        if (typeof default_value === "boolean")
            return params.has(key);
        // If the query parameter is a string, and it is not set, return the default
        if (params.has(key))
            return params.get(key);
        return default_value;
    }, function (value) {
        var url = location_1.get_location_url(hash);
        var params = url.searchParams;
        if (typeof default_value === "boolean") {
            // If the end-developer specified that the query parameter was a boolean, then we need to set if truthy
            if (value)
                params.set(key, "");
            else
                params.delete(key);
        }
        else {
            // If the query parameter is a string, then we set it, if the string is not empty or doesn't equal default
            if (!value || value === default_value)
                params.delete(key);
            else
                params.set(key, value);
        }
        // HACK: When boolean query parameters are set via `URLSearchParams.set`, they render as `?my_key=`, but we expect
        // rendering as `?my_key`. So we need to fix that
        return params
            .toString()
            .replace(/=&/g, "&")
            .replace(/=$/g, "");
    });
}
exports.query_param = query_param;
//# sourceMappingURL=query_param.js.map