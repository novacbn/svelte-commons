import { SvelteComponent } from "svelte/internal";
import { Readable, Writable } from "svelte/store";
import { goto } from "../../util/browser/location";
import { IRouterMap, IRouterParameters, IQueryParams } from "../../util/shared/url";
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
 * Returns a new [[IRouterReturn]] object, which contains Stores and utility functions for getting details about the current router state, and navigation
 * @param routes
 * @param options
 */
export declare function router(routes: IRouterMap, options: Partial<IRouterOptions>): IRouterReturn;
