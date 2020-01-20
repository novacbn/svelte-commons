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
 */
var ROUTE_PARAMETER_EXPRESSION = /:[^\s/]+/g;
/**
 * Returns the normalized version of the `pathname` string (via `URL`)
 * @param pathname
 */
function normalize_pathname(pathname) {
    return new URL(pathname, "http://localhost").pathname;
}
/**
 * Returns the sorting for route patterns, sorting longer (more specific) patterns
 * higher than shorter (less specific) patterns
 * @param a
 * @param b
 */
function sort_routes(a, b) {
    return b[0].length - a[0].length;
}
/**
 * Returns a pathname matching function, that returns the named parameters in
 * the given pathname if the route matched
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
exports.compile_route = compile_route;
/**
 * Returns a pathname matching function
 * @param routes
 */
function make_router(routes) {
    // source: https://stackoverflow.com/a/40739605
    var route_entries = Object.entries(routes);
    route_entries = route_entries.sort(sort_routes);
    var compiled_routes = route_entries.map(function (_a) {
        var _b = __read(_a, 2), route = _b[0], Component = _b[1];
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