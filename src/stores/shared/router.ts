import {SvelteComponent} from "svelte/internal";
import {Readable, Writable, derived, readable, writable} from "svelte/store";

import {IGotoOptions, get_location_url, goto} from "../../util/browser/location";
import {IS_BROWSER} from "../../util/shared/browser";

import {
    IRouter,
    IRouterMap,
    IRouterParameters,
    IQueryParams,
    format_url,
    make_router,
    parse_query
} from "../../util/shared/url";

/**
 * Represents the options passable into the [[router]] Svelte Store
 */
export interface IRouterOptions {
    /**
     * Represents the base url of your application, e.g. if the entry point is `https://my.domain/my-application`, you should set to `/my-application/`
     *
     * **NOTE**: The [[router]] Store also reads from any [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) elements in `<head>`, if present
     */
    base_url: string;

    /**
     * Represents if the URL hash should be used as the href source, e.g. `https://my.domain/path/to/route?x=y` or `https://my.domain/#path/to/route?x=y`
     */
    hash: boolean;

    /**
     * Represents the current / initial href of the [[router]] Store, used on Server to facilitate SSR routing
     *
     * > **NOTE**: This option is ignored on Browsers
     */
    href: string;
}

/**
 * Represents the functions and Stores returned by [[router]], used for programatically interacting with it
 */
export interface IRouterReturn {
    /**
     * Represents a `Readable` Store that outputs the current Component, if there is a matching route
     *
     * **NOTE**: If the Store outputs `undefined`, you should treat that as a 404 error
     */
    component: Readable<SvelteComponent | null>;

    /**
     * Represents a `Readable` (Browser) / `Writable` (Server) Store that outputs the current full href string
     */
    href: Readable<string> | Writable<string>;

    /**
     * Represents a bound [[goto]] function, with its [[IGotoOptions.base_url]] / [[IGotoOptions.hash]] already set
     */
    goto: typeof goto;

    /**
     * Represents a `Readable` Store that outputs a `URL` instance of the current [[IRouterReturn.href]] value
     */
    url: Readable<URL>;

    /**
     * Represents an object of `Readable` Stores relating to the current webpage details
     */
    page: {
        /**
         * Represents a `Readable` Store of the current hostname of a [[router]] instance, usually taken from [[IRouterOptions.url]] or [`Location.host`](https://developer.mozilla.org/en-US/docs/Web/API/Location/host)
         */
        host: Readable<string>;

        /**
         * Represents a `Readable` Store of the current pathname of a [[router]] instance
         */
        path: Readable<string>;

        /**
         * Represents a `Readable` Store of the current parsed URL parameters of a [[router]] instance
         */
        params: Readable<IRouterParameters>;

        /**
         * Represents a `Readable` Store of the current query string, parsed into a key-value mapping, from a [[router]] instance
         */
        query: Readable<IQueryParams>;
    };
}

/**
 * Returns the options passable into the [[router]] Svelte Store, with standard defaults
 *
 * @internal
 *
 * @param options
 */
function RouterOptions(options: Partial<IRouterOptions> = {}): IRouterOptions {
    let {base_url = "", hash = false, href = ""} = options;

    if (IS_BROWSER) {
        // So the end-developer does not have to specifiy, we can fill in the `.href` on Browser context if needed
        if (!href) href = location.href;

        // In the same-vein, and we can also support `<base href="XXX" />` elements as a source for the base URL
        if (!base_url && location.href !== document.baseURI) {
            base_url = new URL(document.baseURI).pathname;
        }
    }

    return {base_url, hash, href};
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
function make_href_store(href: string = "", hash: boolean = false): Readable<string> {
    // If we're running on Server, usually some kind of middleware will be
    // handling this Store and updating it
    if (!IS_BROWSER) return writable(href);

    return readable(get_location_url(hash).href, (set) => {
        function on_popstate(event: PopStateEvent) {
            set(get_location_url(hash).href);
        }

        set(get_location_url(hash).href);
        window.addEventListener("popstate", on_popstate);
        return () => {
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
function make_router_store(
    router: IRouter,
    href: Readable<string>
): Readable<[IRouterParameters, SvelteComponent] | null> {
    return derived(href, (value) => {
        const url = new URL(value);

        return router(format_url(url, false));
    });
}

/**
 * Returns a new [[IRouterReturn]] object, which contains Stores and utility functions for getting details about the current router state, and navigation
 * @param routes
 * @param options
 */
export function router(routes: IRouterMap, options: Partial<IRouterOptions>): IRouterReturn {
    const {base_url, hash, href} = RouterOptions(options);
    const router = make_router(routes, base_url);

    function _goto(href: string, options: Partial<IGotoOptions> = {}): void {
        return goto(href, {...options, base_url, hash});
    }

    const href_store = make_href_store(href, hash);
    const router_store = make_router_store(router, href_store);
    const url_store = derived(href_store, (value) => new URL(value));

    return {
        component: derived(router_store, (value) => (value ? value[1] : null)),
        href: href_store,
        goto: _goto,
        url: url_store,

        page: {
            host: derived(url_store, (value) => value.host),
            path: derived(url_store, (value) => value.pathname),
            params: derived(router_store, (value) => (value ? value[0] : {})),
            query: derived(url_store, (value) => parse_query(value))
        }
    };
}
