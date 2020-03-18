import { Readable, Writable } from "svelte/store";
/**
 * Represents a Svelte Store factory, for making [`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location)-based `Writable` Stores
 */
export declare type ILocationStore = (options: Partial<ILocationOptions>) => Readable<string> | Writable<string>;
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
     * Represents if updates to the Store should creating a new [History](https://developer.mozilla.org/en-US/docs/Web/API/History_API) entry or not, e.g. back button-able
     */
    replace: boolean;
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
export declare const hash: ILocationStore;
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
export declare const pathname: ILocationStore;
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
export declare const search: ILocationStore;
