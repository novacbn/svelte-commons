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
import { derived, readable, writable } from "svelte/store";
import { get_location_url, goto } from "../../util/browser/location";
import { IS_BROWSER } from "../../util/shared/browser";
import { make_router, parse_query } from "../../util/shared/url";
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
    if (IS_BROWSER) {
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
    if (!IS_BROWSER)
        return writable(href);
    return readable(get_location_url(hash).href, function (set) {
        function on_popstate(event) {
            set(get_location_url(hash).href);
        }
        set(get_location_url(hash).href);
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
    return derived(href, function (value) {
        var url = new URL(value);
        return router(url.pathname);
    });
}
/**
 * Returns a new [[IRouterReturn]] object, which contains Stores and utility functions for getting details about the current router state, and navigation
 *
 * For your basic Web Application that has a Web Server configured to route all traffic to `/index.html`:
 *
 * ```html
 * <script>
 *     import {router} from "svelte-commons/lib/stores/shared";
 *
 *     import Error404 from "./routes/_404.svelte";
 *
 *     import Home from "./routes/Index.svelte";
 *     import About from "./routes/About.svelte";
 *
 *     import Blog from "./routes/blog/Index.svelte";
 *     import BlogPost from "./routes/blog/posts/Index.svelte";
 *
 *     // Below declares our `Route -> Svelte Component` mapping, which uses the common
 *     // `/path/to/view/:parameter` pattern format
 *     const routes = {
 *         "/": Home,
 *         "/about": About
 *
 *         "/blog": Blog,
 *         "/blog/:id": BlogPost
 *     };
 *
 *     // The `router` Store returns us an `IRouteReturn` instance, which has our current router state
 *     // and functions. It vaguely resembles the API of Sapper, with some extra goodies
 *     const {component, goto, page} = router(routes);
 *     const {params, query} = page;
 *
 *     function on_click(event) {
 *         goto(event.target.href);
 *     }
 * </script>
 *
 * <nav>
 *     <!--
 *         We need to hijack our link anchors to pass through the returned `goto`
 *         function, that way we can avoid full page navigations
 *     -->
 *     <a href="/" on:click|preventDefault={on_click}>Home</a>
 *     <a href="/about" on:click|preventDefault={on_click}>About</a>
 *     <a href="/blog" on:click|preventDefault={on_click}>Blog</a>
 * </nav>
 *
 * <main>
 *     <!-- The `component` Store returns Svelte Component that matches the current route -->
 *     {#if $component}
 *         <!-- Using the `svelte:component` Component Directive, we render the route and pass in the available URL parameters and query params  -->
 *         <svelte:component this={$component} params={$params} query={$query} />
 *     {:else}
 *         <!-- If no matching route was matched, treat as a 404 -->
 *         <Error404 />
 *     {/if}
 * </main>
 * ```
 *
 * Alternatively, if SSR (Server-Side Rendering) or other Server-oriented interactions are not in your scope, you can enable [[IRouterOptions.hash]] for hash mode:
 *
 * ```html
 * <script>
 *     import {router} from "svelte-commons/lib/stores/shared";
 *
 *     import Error404 from "./routes/_404.svelte";
 *
 *     import Home from "./routes/Index.svelte";
 *     import About from "./routes/About.svelte";
 *
 *     import Blog from "./routes/blog/Index.svelte";
 *     import BlogPost from "./routes/blog/posts/Index.svelte";
 *
 *     const routes = {
 *         "/": Home,
 *         "/about": About
 *
 *         "/blog": Blog,
 *         "/blog/:id": BlogPost
 *     };
 *
 *     // Passing in `IRouterReturn.hash` enables hash mode
 *     const {component, page} = router(routes, {hash: true});
 *     const {params, query} = page;
 * </script>
 *
 * <nav>
 *     <!--
 *         Below, we don't need to hijack click events anymore. Since hash
 *         links don't make the Browser do full-page navigations
 *     -->
 *     <a href="#/">Home</a>
 *     <a href="#/about">About</a>
 *     <a href="#/blog">Blog</a>
 * </nav>
 *
 * <main>
 *     <!-- The rest of the layout template is exactly the same as our non-hash mode version -->
 *     {#if $component}
 *         <svelte:component this={$component} params={$params} query={$query} />
 *     {:else}
 *         <Error404 />
 *     {/if}
 * </main>
 * ```
 *
 * And for SSR implementors, just pass in the current Server URL to [[IRouterOptions.href]] for the `router` Store to work:
 *
 * ```html
 * <script>
 *     import {router} from "svelte-commons/lib/stores/shared";
 *
 *     // We'll expose the current URL href to the rest of our SSR framework, so it can just do:
 *     // `const ret = App.render({href: "https://my.domain/blog/javascript-frameworks-the-good-and-bad"})`
 *     export let href = "";
 *
 *     // Using the same `router` API as before, we just need to pass in `IRouterOptions.href`
 *     const ret = router(..., {href});
 * </script>
 * ```
 *
 * @param routes
 * @param options
 */
export function router(routes, options) {
    var _a = RouterOptions(options), base_url = _a.base_url, hash = _a.hash, href = _a.href;
    var router = make_router(routes, base_url);
    function _goto(href, options) {
        if (options === void 0) { options = {}; }
        return goto(href, __assign(__assign({}, options), { base_url: base_url, hash: hash }));
    }
    var href_store = make_href_store(href, hash);
    var router_store = make_router_store(router, href_store);
    var url_store = derived(href_store, function (value) { return new URL(value); });
    return {
        component: derived(router_store, function (value) { return (value ? value[1] : null); }),
        href: href_store,
        goto: _goto,
        url: url_store,
        page: {
            host: derived(url_store, function (value) { return value.host; }),
            path: derived(url_store, function (value) { return value.pathname; }),
            params: derived(router_store, function (value) { return (value ? value[0] : {}); }),
            query: derived(url_store, function (value) { return parse_query(value); })
        }
    };
}
//# sourceMappingURL=router.js.map