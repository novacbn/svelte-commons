import {SvelteComponent} from "svelte/internal";
import {Readable, Writable, readable, writable} from "svelte/store";

import {
    get_query_params,
    update_query_params,
    get_url,
    update_url
} from "../../util/browser/location";

import {CONTEXT_IS_BROWSER} from "../../util/shared/context";

import {IRouterMap, IRouterParameters, make_router} from "../../util";

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
 * Returns the standardized defaults for options passed into `pathname` Store
 *
 * @internal
 *
 * @param options
 */
function PathnameOptions(options: IPathnameOptions = {}): IPathnameOptions {
    return {
        hash: false,
        push_state: true,
        ...options
    };
}

/**
 * Returns the standardized defaults for options passed into `query_param` Store
 *
 * @internal
 *
 * @param options
 */
function QueryParamOptions(options: IQueryParamOptions = {}): IQueryParamOptions {
    return {
        hash: false,
        ...options
    };
}

/**
 * Returns a `Readable` (Server) / `Writable` (Browser) Svelte Store for listening / modifying `location.hash`
 *
 * NOTE: For convenience, values read / written already have their prefixing "#" removed / added respectively
 *
 * As a minimal example:
 *
 * ```html
 * <script>
 *     import {hash} from "svelte-commons/stores/browser";
 *
 *     // Here, we're binding to `location.hash`. The Store's
 *     // value will default to the initial value of `location.hash`
 *     const store = hash();
 * </script>
 *
 * // Using the `$` prefix, our Component will reactively listen to the Store
 * {#if $store === "I-am-a-hash-string"}
 *     Hi :)
 * {:else}
 *     Click <a href="#I-am-a-hash-string">here</a> to see a secret!
 * {/if}
 * ```
 */

export function hash(): Readable<string> | Writable<string> {
    const url = get_url();

    if (!CONTEXT_IS_BROWSER) return readable(url.hash, () => {});

    const store = writable(url.hash, (set) => {
        function on_hash_change() {
            set(location.hash ? location.hash.slice(1) : "");
        }

        set(location.hash ? location.hash.slice(1) : "");
        window.addEventListener("hashchange", on_hash_change);

        return () => {
            window.removeEventListener("hashchange", on_hash_change);
        };
    });

    store.subscribe((value) => {
        location.hash = "#" + value;
    });

    return store;
}

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
export function pathname(options: IPathnameOptions = {}): Readable<string> | Writable<string> {
    const {hash, push_state} = PathnameOptions(options);
    let _pathname = get_url(hash).pathname;

    if (!CONTEXT_IS_BROWSER) return readable(_pathname, () => {});

    const event_name = hash ? "hashchange" : "popstate";

    const store = writable(_pathname, (set) => {
        function on_url_change() {
            const {pathname} = get_url(hash);

            _pathname = pathname;
            set(pathname);
        }

        // Need to make sure we're always fresh, whenever we initialize again
        on_url_change();

        window.addEventListener(event_name, on_url_change);
        return () => {
            window.removeEventListener(event_name, on_url_change);
        };
    });

    store.subscribe((value) => {
        const url = new URL(value, location.origin);

        // We want to make sure that we don't update the Browser history
        // on our initial value or window events
        if (_pathname !== url.pathname) update_url(url, hash, push_state);
    });

    return store;
}

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
export function router(
    routes: IRouterMap,
    options: IPathnameOptions = {}
): Readable<IRouterValue | null> {
    const router = make_router(routes);
    const store = pathname(options);

    return readable<IRouterValue | null>(null, (set) => {
        function on_pathname(pathname: string) {
            const results = router(pathname);

            if (results) set({Component: results[1], parameters: results[0]});
            else set(null);
        }

        const unsubscribe = store.subscribe(on_pathname);
        return () => {
            unsubscribe();
        };
    });
}

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
export function query_param<T = boolean | string>(
    key: string,
    default_value: boolean | string = "",
    options: IQueryParamOptions = {}
): Readable<T> | Writable<T> {
    const {hash} = QueryParamOptions(options);

    const params = get_query_params(hash);
    const stored_value = typeof params[key] !== "undefined" ? params[key] : default_value;

    if (!CONTEXT_IS_BROWSER) return readable<T>(stored_value as any, () => {});

    const store = writable<T>(stored_value as any);

    store.subscribe((value: any) => {
        if (value === default_value) update_query_params({[key]: undefined}, hash);
        else update_query_params({[key]: value}, hash);
    });

    return store;
}
