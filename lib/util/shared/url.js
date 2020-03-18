"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents the Regular Expression to match patterns in route patterns, e.g. `/my/route/:parameter/:names`
 *
 * @internal
 */
var ROUTE_PARAMETER_EXPRESSION = /:[^\s/]+/g;
/**
 * Returns a pathname matching function, that returns the named parameters in
 * the given pathname if the route matched
 *
 * @internal
 *
 * @param route
 */
function compile_route(route) {
    // source: https://stackoverflow.com/a/40739605
    route = normalize_pathname(route);
    var parameters = [];
    var expression = new RegExp("^" + route.replace(ROUTE_PARAMETER_EXPRESSION, "([\\w-]+)") + "$");
    // We need to collect the parameters name from the route pattern in order,
    // so the matching function return the parsed pathnames as named keys
    var match;
    while ((match = ROUTE_PARAMETER_EXPRESSION.exec(route))) {
        parameters.push(match[0].slice(1));
    }
    return function (pathname) {
        pathname = normalize_pathname(pathname);
        var match = expression.exec(pathname);
        if (match) {
            var _parameters = {};
            for (var index in parameters) {
                // `RegExp.exec` returns the matched value as index `0`,
                // so we need to increment by `1`
                _parameters[parameters[index]] = match[parseInt(index) + 1];
            }
            return _parameters;
        }
        return null;
    };
}
/**
 * Returns the sorting for route patterns, sorting longer (more specific) patterns
 * higher than shorter (less specific) patterns
 *
 * @internal
 *
 * @param a
 * @param b
 */
function sort_routes(a, b) {
    return b[0].length - a[0].length;
}
/**
 * Returns a `URL` instance stringified via `.pathname` + `.search` + `.hash`
 *
 * > **NOTE**: Set `include_hash` to `false`, to disable including `.hash` as a postfix
 *
 * ```javascript
 * import {format_url} from "svelte-commons/lib/util/shared";
 *
 * const url = new URL("https://my.domain/path/to/application?x=2#header-id");
 *
 * // Here, we're formating it with all three URL components
 * const format_hash = format_url(url);
 * console.log(format_hash); // logs: `/path/to/application?x=2#header-id`
 *
 * // Optionally though. you can disable including the `.hash` component
 * const format_no_hash = format_url(url, false);
 * console.log(format_no_hash); // logs: `/path/to/application?x=2`
 * ```
 *
 * @param url
 * @param include_hash
 */
function format_url(url, include_hash) {
    if (include_hash === void 0) { include_hash = true; }
    var hash = url.hash, pathname = url.pathname, search = url.search;
    if (include_hash)
        return pathname + search + hash;
    return pathname + search;
}
exports.format_url = format_url;
/**
 * Returns if the `href` is an internal webpage link, e.g. `/path/to/page` or `this/is/a/path`
 *
 * > **RULES**:
 * > - URLs with a protocol, e.g. `https://my.domain/index.html`, are considered external
 * > - URLs that are protocol independent, e.g. `//cdn-provider.com/some_stylesheet.css` are considered external
 *
 * ```javascript
 * import {is_internal_href} from "svelte-commons/lib/util/shared";
 *
 * const href = "/path/to/application?x=1";
 * const url = "https://google.com";
 *
 * console.log(is_internal_href(href)); // logs: `true`
 * console.log(is_internal_href(url)); // logs: `false`
 * ```
 *
 * @param href
 */
function is_internal_href(href) {
    return !href.match(/^\w+:\/\//) && !href.startsWith("//");
}
exports.is_internal_href = is_internal_href;
/**
 * Returns the `a` and `b` URLs joined together naively
 *
 * > **RULES**:
 * > - Protocols, domains, ports are ignored for both URLs
 * > - Hash string, and query parameters are ignored for `a` URL
 * > - `b` URL's hash string and query parameters will be in the resulting URL
 * > - The resulting URL pathname are normalized after being joined
 *
 * ```javascript
 * import {join} from "svelte-commons/lib/util/shared";
 *
 * // We're going to join `a` and `b` together, however the protocol and domain will be
 * // dropped from `a`, along with the query parameters
 * const a = "https://my.domain/path/to/application?x=1";
 * const b = "/sub-page?x=2";
 *
 * const joined = join(a, b);
 *
 * console.log(joined); // logs: `/path/to/application/sub-page?x=2`
 * ```
 *
 * @param a
 * @param b
 */
function join(a, b) {
    var a_pathname = new URL(a, "http://localhost").pathname;
    var _a = new URL(b, "http://localhost"), hash = _a.hash, search = _a.search, b_pathname = _a.pathname;
    return normalize_pathname(a_pathname + "/" + b_pathname) + search + hash;
}
exports.join = join;
/**
 * Returns the normalized version of the `pathname` parameter
 *
 * > **RULES**:
 * > - Backward slashes `\` are converted to forward slashes `/`
 * > - Consecutive forward slashes `/` are reduced to a single slash
 * > - Forward slashes `/` are trimmed from the beginning and end of the string
 * > - Up directory directives `../` are evaluated, removing it and the parent directory if exists
 * >     - **NOTE**: Parent directories are currently matched to alphanumeric chatacters, periods, spaces, tildes, underscores and dashes
 * >     - **REGEX**: [\w_\.\-\s~]+
 *
 * ```javascript
 * import {normalize_pathname} from "svelte-commons/lib/util/shared";
 *
 * // Below we have a pathname with Windows separators `\`, consecutive separators `//`, and up directory directives `../`
 * const malformed_pathname = "\\path/to//application/src/../assets"; // NOTE: `\\` renders as `\`, since `\` normally escapes in strings
 *
 * const normalized = normalize_pathname(malformed_pathname);
 *
 * console.log(normalized); // logs: `/path/to/application/assets`
 * ```
 *
 * @param pathname
 */
function normalize_pathname(pathname) {
    return pathname
        .replace(/\\+/g, "/")
        .replace(/[\/\/]+/g, "/")
        .replace(/([\w_\.\-\s~]+\/)?(\.\.\/)/g, "")
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
}
exports.normalize_pathname = normalize_pathname;
/**
 * Returns a query string parsed into a key-value mapping
 *
 * ```javascript
 * import {parse_query} from "svelte-commons/lib/util/shared";
 *
 * const query_string = "?sorting=ASCENDING&remove-inactive";
 *
 * const mapping = parse_query(query_string);
 *
 * console.log(mapping); logs: `{"sorting": "ASCENDING", "remove-inactive": true}`
 * ```
 *
 * @param query
 */
function parse_query(query) {
    if (typeof query === "string")
        query = new URLSearchParams(query);
    else if (query instanceof URL)
        query = query.searchParams;
    var entries = Array.from(query.entries(), function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        // Since boolean query parameters, e.g. `?x=` / `?x`, have no value, we need to them to `true`
        if (value)
            return [key, value];
        return [key, true];
    });
    // NOTE: Just to increase supported Browsers, e.g. pre-Chromium Microsoft Edge, using a `.reduce` instead of `Object.fromEntries`
    return entries.reduce(function (accum, _a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        accum[key] = value;
        return accum;
    }, {});
}
exports.parse_query = parse_query;
/**
 * Returns a function that matches parameterized routes, returning the assigned values and parsed parameters
 *
 * ```javascript
 * import {make_router} from "svelte-commons/lib/util/shared";
 *
 * import ComponentOne from "...";
 * import ComponentTwo from "...";
 *
 * // Below, we're defining our route mappings, along with their assigned Svelte Components
 * const routes = {
 *     "/": ComponentOne,
 *     "/items/:id": ComponentTwo
 * };
 *
 * // Now we feed our mappings into the factory function, which gives us a matcher function
 * const router = make_router(routes);
 *
 * // First, let's try matching our first route
 * console.log(router("/")); // logs: `[{}, ComponentOne]`
 *
 * // Next, let's try matching our second route
 * console.log(router("/items/blue-jeans")); // logs: `[{id: "blue-jeans"}, ComponentTwo]`
 *
 * // Finally, we can see that if we pass an invalid route, `null` is returned. Which should
 * // be treated the same as a "404"
 * console.log(router("/some/invalid/route")); // logs: `null`
 * ```
 *
 * @param routes
 * @param base
 */
function make_router(routes, base) {
    if (base === void 0) { base = ""; }
    // source: https://stackoverflow.com/a/40739605
    var route_entries = Object.entries(routes);
    route_entries = route_entries.sort(sort_routes);
    var compiled_routes = route_entries.map(function (_a) {
        var _b = __read(_a, 2), route = _b[0], Component = _b[1];
        // Add support for end-developers passing a base URL, e.g. `https://my.domain/path/to/application`
        if (base)
            route = join(base, route);
        var match = compile_route(route);
        return [route, match, Component];
    });
    return function (pathname) {
        var e_1, _a;
        try {
            for (var compiled_routes_1 = __values(compiled_routes), compiled_routes_1_1 = compiled_routes_1.next(); !compiled_routes_1_1.done; compiled_routes_1_1 = compiled_routes_1.next()) {
                var _b = __read(compiled_routes_1_1.value, 3), route = _b[0], match = _b[1], Component = _b[2];
                var parameters = match(pathname);
                if (parameters)
                    return [parameters, Component];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (compiled_routes_1_1 && !compiled_routes_1_1.done && (_a = compiled_routes_1.return)) _a.call(compiled_routes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
}
exports.make_router = make_router;
//# sourceMappingURL=url.js.map