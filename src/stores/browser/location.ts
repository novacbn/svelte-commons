import {Readable, Writable, readable, writable} from "svelte/store";

import {get_location_url, update_location_url} from "../../util/browser/location";

import {overlay} from "../shared/overlay";

/**
 * Represents a Svelte Store factory, for making [`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location)-based `Writable` Stores
 */
export type ILocationStore = (
    options: Partial<ILocationOptions>
) => Readable<string> | Writable<string>;

/**
 * Represents the options passable into the [[hash]], [[pathname]], and [[search]] Svelte Stores
 */
export interface ILocationOptions {
    /**
     * Represents if the URL hash should be used as the href source, e.g. `https://my.domain/x/y/z` or `https://my.domain/#x/y/z`
     */
    hash: boolean;

    /**
     * Represents if the Store returned is a `Readable` Store, rather than a `Writable`
     */
    readonly: boolean;

    /**
     * Represents if updates to the Store should creating a new [History](https://developer.mozilla.org/en-US/docs/Web/API/History_API) entry or not, e.g. Forward / Back Button-able
     */
    replace: boolean;
}

/**
 * Returns the options passable into the [[hash]], [[pathname]], or [[search]] Svelte Stores, with standard defaults
 *
 * @internal
 *
 * @param options
 */
function LocationOptions(options: Partial<ILocationOptions> = {}): ILocationOptions {
    const {hash = false, readonly = false, replace = false} = options;

    return {hash, readonly, replace};
}

/**
 * Returns a factory function, for binding a [`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location) component into a `Writable` Svelte Store
 *
 * @internal
 *
 * @param component
 */
function make_location_store(component: string): ILocationStore {
    return (options) => {
        const {hash, readonly, replace} = LocationOptions(options);

        function get_value(): string {
            const url = get_location_url(hash);

            return (url as any)[component];
        }

        function on_start(set: (value: string) => void) {
            function on_popstate(event: PopStateEvent) {
                set(get_value());
            }

            set(get_value());
            window.addEventListener("popstate", on_popstate);
            return () => {
                window.removeEventListener("popstate", on_popstate);
            };
        }

        if (readonly) return readable(get_value(), on_start);

        function set_value(value: string): void {
            const url = get_location_url(hash);

            (url as any)[component] = value;

            update_location_url(url, hash, replace);
        }

        const store = writable(get_value(), on_start);

        return overlay(
            store,
            (value) => value,
            (value) => {
                set_value(value);

                return value;
            }
        );
    };
}

/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.hash`](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) component
 *
 * In normal mode, which parses the current Browser URL normally:
 *
 * ```html
 * <script>
 *     import {hash} from "svelte-commons/lib/stores/browser";
 *
 *     const store = hash();
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/path/to/application#I-am-a-hash` is `#I-am-a-hash` -->
 * Current hash string is: <span style="color:red;">{$store}</span>!
 * ```
 *
 * In hash mode, which parses current Browser URL's hash string **AS** the URL:
 *
 * ```html
 * <script>
 *     import {hash} from "svelte-commons/lib/stores/browser";
 *
 *     const store = hash({hash: true});
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/#/path/to/application#I-am-a-hash` is `#I-am-a-hash` -->
 * Current hash string is: <span style="color:red;">{$store}</span>!
 * ```
 *
 * You can also update the Store to change the hash, along with making it replace current History entry:
 *
 * ```html
 * <script>
 *     import {hash} from "svelte-commons/lib/stores/browser";
 *
 *     // By passing `ILocationOptions.replace`, changes wont create new History
 *     // entries, e.g. more entries for Back / Forward Button
 *     const store = hash({replace: true});
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/path/to/application` will update to `https://my.domain/path/to/application#I-am-a-hash` -->
 * <a on:click|preventDefault={() => $store = "#I-am-a-hash"}>Click me</a> to change the hash string!
 * ```
 *
 * @param options
 */
export const hash = make_location_store("hash");

/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) component
 *
 * In normal mode, which parses the current Browser URL normally:
 *
 * ```html
 * <script>
 *     import {pathname} from "svelte-commons/lib/stores/browser";
 *
 *     const store = pathname();
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/path/to/application` is `/path/to/application` -->
 * Current pathname is: <span style="color:red;">{$store}</span>!
 * ```
 *
 * In hash mode, which parses current Browser URL's hash string **AS** the URL:
 *
 * ```html
 * <script>
 *     import {pathname} from "svelte-commons/lib/stores/browser";
 *
 *     const store = pathname({hash: true});
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/#/path/to/application` is `/path/to/application` -->
 * Current pathname is: <span style="color:red;">{$store}</span>!
 * ```
 *
 * You can also update the Store to change the pathname, along with making it replace current History entry:
 *
 * ```html
 * <script>
 *     import {pathname} from "svelte-commons/lib/stores/browser";
 *
 *     // By passing `ILocationOptions.replace`, changes wont create new History
 *     // entries, e.g. more entries for Back / Forward Button
 *     const store = pathname({replace: true});
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/path/to/application` will update to `https://my.domain/path/to/other-application` -->
 * <a on:click|preventDefault={() => $store = "/path/to/other-application"}>Click me</a> to change the pathname!
 * ```
 *
 * @param options
 */
export const pathname = make_location_store("pathname");

/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.search`](https://developer.mozilla.org/en-US/docs/Web/API/Location/search) component
 *
 * In normal mode, which parses the current Browser URL normally:
 *
 * ```html
 * <script>
 *     import {search} from "svelte-commons/lib/stores/browser";
 *
 *     const store = search();
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/path/to/application?x=1` is `?x=1` -->
 * Current query string is: <span style="color:red;">{$store}</span>!
 * ```
 *
 * In hash mode, which parses current Browser URL's hash string **AS** the URL:
 *
 * ```html
 * <script>
 *     import {search} from "svelte-commons/lib/stores/browser";
 *
 *     const store = search({hash: true});
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/#/path/to/application?x=1` is `?x=1` -->
 * Current query string is: <span style="color:red;">{$store}</span>!
 * ```
 *
 * You can also update the Store to change the query string, along with making it replace current History entry:
 *
 * ```html
 * <script>
 *     import {search} from "svelte-commons/lib/stores/browser";
 *
 *     // By passing `ILocationOptions.replace`, changes wont create new History
 *     // entries, e.g. more entries for Back / Forward Button
 *     const store = search({replace: true});
 * </script>
 *
 * <!-- e.g. Browser URL of `https://my.domain/path/to/application` will update to `https://my.domain/path/to/application?x=1` -->
 * <a on:click|preventDefault={() => $store = "?x=1"}>Click me</a> to change the query string!
 * ```
 *
 * @param options
 */
export const search = make_location_store("search");
