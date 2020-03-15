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
    var _a = options.base_url, base_url = _a === void 0 ? "" : _a, _b = options.hash, hash = _b === void 0 ? false : _b, _c = options.href, href = _c === void 0 ? "" : _c;
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
 * Returns a `Readable` (Browser) / `Writable` (Server) Store that outputs the current full href
 *
 * > **NOTE**: On Browsers, the href will be pulled from [`Location.href`](https://developer.mozilla.org/en-US/docs/Web/API/Location/href)
 * > **NOTE**: On Servers, a middleware should be responsible for updating the Store
 *
 * @internal
 *
 * @param href
 * @param hash
 */
function make_href_store(href, hash) {
    if (href === void 0) { href = ""; }
    if (hash === void 0) { hash = false; }
    // If we're running on Server, usually some kind of middleware will be
    // handling this Store and updating it
    if (!browser_1.IS_BROWSER)
        return store_1.writable(href);
    return store_1.readable(location_1.get_location_url(hash).href, function (set) {
        function on_popstate(event) {
            set(location_1.get_location_url(hash).href);
        }
        set(location_1.get_location_url(hash).href);
        window.addEventListener("popstate", on_popstate);
        return function () {
            window.removeEventListener("popstate", on_popstate);
        };
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
        return router(url_1.format_url(url, false));
    });
}
/**
 * Returns a new [[IRouterReturn]] object, which contains Stores and utility functions for getting details about the current router state, and navigation
 * @param routes
 * @param options
 */
function router(routes, options) {
    var _a = RouterOptions(options), base_url = _a.base_url, hash = _a.hash, href = _a.href;
    var router = url_1.make_router(routes, base_url);
    function _goto(href, options) {
        if (options === void 0) { options = {}; }
        return location_1.goto(href, __assign(__assign({}, options), { base_url: base_url, hash: hash }));
    }
    var href_store = make_href_store(href, hash);
    var router_store = make_router_store(router, href_store);
    var url_store = store_1.derived(href_store, function (value) { return new URL(value); });
    return {
        component: store_1.derived(router_store, function (value) { return (value ? value[1] : null); }),
        href: href_store,
        goto: _goto,
        url: url_store,
        page: {
            host: store_1.derived(url_store, function (value) { return value.host; }),
            path: store_1.derived(url_store, function (value) { return value.pathname; }),
            params: store_1.derived(router_store, function (value) { return (value ? value[0] : {}); }),
            query: store_1.derived(url_store, function (value) { return url_1.parse_query(value); })
        }
    };
}
exports.router = router;
//# sourceMappingURL=router.js.map