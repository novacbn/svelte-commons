import {SvelteComponent} from "svelte/internal";
import {Readable, derived, readable} from "svelte/store";

import {IGotoOptions, format_url, get_url, goto} from "../../util/browser/location";
import {IS_BROWSER} from "../../util/shared/browser";
import {IRouter, IRouterMap, IRouterParameters, make_router} from "../../util/shared/url";

/**
 * Represents a query string mapping returned by [[IRouterReturn.query]]
 */
export type IRouterQuery = {[key: string]: boolean | string | undefined};

/**
 * Represents the options passable into the [[router]] Svelte Store
 */
export interface IRouterOptions {
    /**
     * Represents the base url of your application, e.g. if the entry point is `https://my.domain/my-application`, you should set to `/my-application/`
     *
     * **NOTE**: The [[router]] Store also reads from any [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) elements in `<head>`, if present
     *
     * **TODO**: While this property **IS** available, and detection works, it does **NOT** affect anything at the moment!
     */
    base_url: string;

    /**
     * Represents if the URL hash should be used as the href source, e.g. `https://my.domain/path/to/route?x=y` or `https://my.domain/#path/to/route?x=y`
     */
    hash: boolean;

    /**
     * Represents the current / initial href of the [[router]] Store, usually only used on Server to facilitate SSR routing
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
     * Represents a bound [[goto]] function, with its [[IGotoOptions.base_url]] / [[IGotoOptions.hash]] already set
     */
    goto: typeof goto;

    /**
     * Represents an object of `Readable` Stores relating to the current webpage details
     */
    page: {
        /**
         * Represents a `Readable` Store of the current hostname of the [[router]], usually taken from [[IRouterOptions.url]] or [`Location.host`](https://developer.mozilla.org/en-US/docs/Web/API/Location/host)
         */
        host: Readable<string>;

        path: Readable<string>;

        params: Readable<IRouterParameters | null>;

        query: Readable<IRouterQuery>;
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
    let {base_url = "/", hash = false, href = ""} = options;

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
 * Returns a `Readable` Store that takes an initial URL href, then updates to the current [`Location.href`](https://developer.mozilla.org/en-US/docs/Web/API/Location/host) every [`popstate`](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)
 *
 * **NOTE**: If `hash` is `true`, then the initial URL href is ignored
 *
 * @internal
 *
 * @param href
 * @param hash
 */
function make_href_store(href: string = "", hash: boolean = false): Readable<string> {
    function get_value() {
        if (hash) {
            const url = get_url(true);

            return url.href;
        }

        return location.href;
    }

    return readable(hash ? get_value() : href, (set) => {
        function on_popstate(event: PopStateEvent) {
            set(get_value());
        }

        set(get_value());
        window.addEventListener("popstate", on_popstate);
        return () => {
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
function make_location_store(component: string, href: Readable<string>): Readable<string> {
    return derived(href, (value) => {
        const url = new URL(value);

        return (url as any)[component];
    });
}

/**
 * Returns a wrapper `Readable` from a Store that outputs entire href URL, outputting a mapping of query parameters
 *
 * @internal
 *
 * @param href
 */
function make_query_store(href: Readable<string>): Readable<IRouterQuery> {
    return derived(href, (value) => {
        const url = new URL(value);
        const entries = Array.from(url.searchParams.entries());

        const query: [string, boolean | string][] = entries.map(([key, value]) => {
            // Since boolean query parameters, e.g. `?x=` / `?x`, have no value, we need to them to `true`
            if (value) return [key, value];
            return [key, true];
        });

        return query.reduce<IRouterQuery>((accum, [key, value]) => {
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
    const router = make_router(routes);
    const {base_url, hash, href} = RouterOptions(options);

    function goto(href: string, options: Partial<IGotoOptions> = {}): void {
        return goto(href, {...options, base_url, hash});
    }

    const href_store = make_href_store(href, hash);
    const router_store = make_router_store(router, href_store);

    return {
        component: derived(router_store, (value) => (value ? value[1] : null)),
        goto,

        page: {
            host: make_location_store("host", href_store),
            path: make_location_store("pathname", href_store),
            params: derived(router_store, (value) => (value ? value[0] : null)),
            query: make_query_store(href_store)
        }
    };
}
