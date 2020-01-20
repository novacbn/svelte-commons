import { SvelteComponent } from "svelte/internal";
import { Readable, Writable } from "svelte/store";
import { IRouterMap, IRouterParameters } from "../../util";
/**
 * Represents the options passable into `pathname` Svelte Store
 */
export interface IPathnameOptions {
    /**
     * Represents if the `pathname` Store
     */
    hash?: boolean;
    /**
     * Represents if updates to `pathname` Store push a new History state, rather than replace
     */
    push_state?: boolean;
}
/**
 * Represents value provided to subscriptions of the `router` Svelte Store
 */
export interface IRouterValue {
    /**
     * Represents the Svelte Component assigned to the current route
     */
    Component: SvelteComponent;
    /**
     * Represents the parsed parameters of the current route
     */
    parameters: IRouterParameters;
}
/**
 * Represents the options passable into `query_param` Svelte Store
 */
export interface IQueryParamOptions {
    /**
     * Represents if `query_param` should operate in hash mode,
     * e.g. bind to query variables after the URL hashtag `https://my.domain/#path/to/route?my_var=XXXX`
     */
    hash?: boolean;
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
export declare function hash(): Readable<string> | Writable<string>;
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
export declare function pathname(options?: IPathnameOptions): Readable<string> | Writable<string>;
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
export declare function router(routes: IRouterMap, options?: IPathnameOptions): Readable<IRouterValue | null>;
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
export declare function query_param<T = boolean | string>(key: string, default_value?: boolean | string, options?: IQueryParamOptions): Readable<T> | Writable<T>;
