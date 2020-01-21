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
 *     import {hash} from "svelte-commons/lib/stores/browser";
 *
 *     // Here, we're binding to `location.hash`. The Store's
 *     // value will default to the initial value of `location.hash`
 *     const store = hash();
 * </script>
 *
 * // Below will show different messages depending on the current `location.hash`
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
 * As a minimal example:
 *
 * ```html
 * <script>
 *     import {pathname} from "svelte-commons/lib/stores/browser";
 *
 *     const store = pathname();
 * </script>
 *
 * <!--
 *     The below `<h1>` element, will reactively display our current `location.pathname`, in the
 *     case of `http://example.domain/some/path`, it will display `The current pathname is: /some/path`
 * -->
 * <h1>The current pathname is: {$store}</h1>
 * ```
 *
 * And then, you can also bind hash-based pathnames:
 *
 * ```html
 * <script>
 *     import {pathname} from "svelte-commons/lib/stores/browser";
 *
 *     // By passing `.hash = true`, we're binding hash-based URLs like `http://example.domain/#some/path`. Instead
 *     // of server-based pathnames like `http://example.domain/some/path`
 *     const store = pathname({hash: true});
 * </script>
 *
 * <!--
 *     Below will show different message depending on the hash-based pathname
 * -->
 * {#if $store === "/happy-message"}
 *     Hi :)
 * {:else}
 *     404: Click <a href="#/happy-message">here</a> to see a secret!
 * {/if}
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
 * For this Store example, we have a two view Components:
 *
 * **views/SampleView.svelte**
 *
 * ```html
 * <script type="module">
 *     let view_count = 0;
 * </script>
 *
 * <script>
 *     // Below, we're incrementing our view count per visit to this route view
 *     view_count += 1;
 * </script>
 *
 * // Next, we're passing the current amount of views into the echo route
 * Seems like you just hit the homepage, try visting <a href="#/echo/{view_count}">here</a>!
 * ```
 *
 * **views/ParameterView.svelte**
 *
 * ```html
 * <script>
 *     // This is the property that will be used by the router as a URL parameter
 *     export let view_count = 0;
 * </script>
 *
 * Wow, it seems like you visited the homepage, <b>{view_count}</b> times!
 * ```
 *
 * Finally we will have our main application Component that will handle matching them:
 *
 * **Application.svelte**
 *
 * ```html
 * <script>
 *     import {router} from "svelte-commons/lib/stores/browser";
 *
 *     import ParameterView from "./views/ParameterView.svelte";
 *     import SampleView from "./views/SampleView.svelte";
 *
 *     // Below, we're creating a new router Store that has two
 *     // of our views bound to two specific hash URLs
 *     const store = router({
 *         "":                  SampleView,
 *         "echo/:view_count":  ParameterView
 *     }, {hash: true});
 *
 *     // Here, we're just reactively listening to our router Store. It will
 *     // return, if any matches found, the target view Component and the URL parameters
 *     let Component, parameters;
 *     $: {
 *         const results = $store;
 *
 *         if (results) ({Component, parameters} = results);
 *         else {
 *             Component = null;
 *             parameters = null;
 *         }
 *     }
 * </script>
 *
 * {#if Component}
 *     <!--
 *         If our router Store returned a match, we render the view Component and
 *         pass in the route parameters
 *     -->
 *
 *     <svelte:component this={Component} {...parameters} />
 * {:else}
 *     <!--
 *         Since no match was returned, we simply display a "404" message
 *     -->
 *
 *     <h1>404 - Unknown route <code>{location.hash.slice(1)}</code></h1>
 * {/if}
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
 * As a minimal example:
 *
 * ```html
 * <script>
 *     import {query_param} from "svelte-commons/lib/stores/browser";
 *
 *     // Here, we're binding the `?my_string_key=XXXX` query parameter. And if the value
 *     // is equal to our default of `Joseph Joestar`, it wont appear in the URL
 *     const store = query_param("my_string_key", "Joseph Joestar");
 * </script>
 *
 * <!--
 *     Below will bind the `<h1>` and `<input />` elements to reactively display our
 *     parameter. And also will allow the end-user to change the parameter as-well
 * -->
 * <h1>Hello, {$store}!</h1>
 * <input type="text" bind:value={$store} />
 * ```
 *
 * You can also bind boolean parameters:
 *
 * ```html
 * <script>
 *     import {query_param} from "svelte-commons/lib/stores/browser";
 *
 *     // Here, we're binding the `?my_boolean_key` query parameter. And we're
 *     // defaulting to `false`.
 *     const store = query_param("my_boolean_key", false);
 *
 *     function on_click(event) {
 *         // This will just simply toggle the parameter in the URL
 *         $store = !$store;
 *     }
 * </script>
 *
 * <!--
 *     Below will display different messages, depending on if the `?my_boolean_key` parameter is
 *     in the URL. And also allow the end-user toggle the parameter in the URL by clicking the button
 * -->
 * {#if $store}
 *     <h1>my_boolean_key is currently set to true!</h1>
 * {:else}
 *     <h1>my_boolean_key is currently set to false...</h1>
 * {/if}
 *
 * <button on:click={on_click}>Toggle Message</button>
 * ```
 *
 * Finally, you can also bind hash-based parameters:
 *
 * ```html
 * <script>
 *     import {query_param} from "svelte-commons/lib/stores/browser";
 *
 *     // This is exactly the same as the first example. Expect instead of reactively
 *     // binding to `http://example.domain/some/path?my_string_key=XXX`, we're binding to hash-based
 *     // URLs. e.g. `http://example.domain/#some/path?my_string_key=XXX`.
 *     const store = query_param("my_string_key", "Joseph Joestar", {hash: true});
 * </script>
 *
 * <h1>Hello, {$store}!</h1>
 * <input type="text" bind:value={$store} />
 * ```
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
