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
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("svelte/store");
var location_1 = require("../../util/browser/location");
var browser_1 = require("../../util/shared/browser");
var url_1 = require("../../util/shared/url");
/**
 * Returns the options passable into the [[router]] Svelte Store, with standard defaults
 *
 * @internal
 *
 * @param options
 */
function RouterOptions(options) {
    if (options === void 0) { options = {}; }
    var _a = options.base_url, base_url = _a === void 0 ? "/" : _a, _b = options.hash, hash = _b === void 0 ? false : _b, _c = options.href, href = _c === void 0 ? "" : _c;
    if (browser_1.IS_BROWSER) {
        // So the end-developer does not have to specifiy, we can fill in the `.href` on Browser context if needed
        if (!href)
            href = location.href;
        // In the same-vein, and we can also support `<base href="XXX" />` elements as a source for the base URL
        if (!base_url && location.href !== document.baseURI) {
            base_url = new URL(document.baseURI).pathname;
        }
    }
    return { base_url: base_url, hash: hash, href: href };
}
/**
 * Returns a `Readable` Store that takes an initial URL href, then updates to the current [`Location.href`](https://developer.mozilla.org/en-US/docs/Web/API/Location/host) every [`popstate`](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)
 *
 * **NOTE**: If `hash` is `true`, then the initial URL href is ignored
 *
 * @internal
 *
 * @param href
 * @param hash
 */
function make_href_store(href, hash) {
    if (href === void 0) { href = ""; }
    if (hash === void 0) { hash = false; }
    function get_value() {
        if (hash) {
            var url = location_1.get_url(true);
            return url.href;
        }
        return location.href;
    }
    return store_1.readable(hash ? get_value() : href, function (set) {
        function on_popstate(event) {
            set(get_value());
        }
        set(get_value());
        window.addEventListener("popstate", on_popstate);
        return function () {
            window.removeEventListener("popstate", on_popstate);
        };
    });
}
/**
 * Returns a wrapper `Readable` from a Store that outputs entire href URL strings, outputting a specific URL component
 *
 * @internal
 *
 * @param component
 * @param href
 */
function make_location_store(component, href) {
    return store_1.derived(href, function (value) {
        var url = new URL(value);
        return url[component];
    });
}
/**
 * Returns a wrapper `Readable` from a Store that outputs entire href URL, outputting a mapping of query parameters
 *
 * @internal
 *
 * @param href
 */
function make_query_store(href) {
    return store_1.derived(href, function (value) {
        var url = new URL(value);
        var entries = Array.from(url.searchParams.entries());
        var query = entries.map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            // Since boolean query parameters, e.g. `?x=` / `?x`, have no value, we need to them to `true`
            if (value)
                return [key, value];
            return [key, true];
        });
        return query.reduce(function (accum, _a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            accum[key] = value;
            return accum;
        }, {});
    });
}
/**
 * Returns a wrapper `Readable` from a Store that outputs entire URL hrefs, outputting the returning result of an [[IRouter]] instance
 *
 * @internal
 *
 * @param router
 * @param href
 */
function make_router_store(router, href) {
    return store_1.derived(href, function (value) {
        var url = new URL(value);
        return router(location_1.format_url(url, false));
    });
}
/**
 * Returns a new [[IRouterReturn]] object, which contains Stores and utility functions for getting details about the current router state, and navigation
 * @param routes
 * @param options
 */
function router(routes, options) {
    var router = url_1.make_router(routes);
    var _a = RouterOptions(options), base_url = _a.base_url, hash = _a.hash, href = _a.href;
    function _goto(href, options) {
        if (options === void 0) { options = {}; }
        return location_1.goto(href, __assign(__assign({}, options), { base_url: base_url, hash: hash }));
    }
    var href_store = make_href_store(href, hash);
    var router_store = make_router_store(router, href_store);
    return {
        component: store_1.derived(router_store, function (value) { return (value ? value[1] : null); }),
        goto: _goto,
        page: {
            host: make_location_store("host", href_store),
            path: make_location_store("pathname", href_store),
            params: store_1.derived(router_store, function (value) { return (value ? value[0] : null); }),
            query: make_query_store(href_store)
        }
    };
}
exports.router = router;
//# sourceMappingURL=router.js.map