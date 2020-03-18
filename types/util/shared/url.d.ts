import { SvelteComponent } from "svelte/internal";
/**
 * Represents the matching function returned by `make_router`
 */
export declare type IRouter = (pathname: string) => [IRouterParameters, SvelteComponent] | null;
/**
 * Represents a set of parsed route pattern parameters
 */
export declare type IRouterParameters = {
    [key: string]: string | undefined;
};
/**
 * Represents the matching function returned by `compile_route`
 */
export declare type IRouterMatcher = (pathname: string) => IRouterParameters | null;
/**
 * Represents a route pattern -> Svelte Component mapping
 */
export interface IRouterMap {
    [key: string]: SvelteComponent;
}
/**
 * Represents the key-value mapping returned by [[parse_query]]
 */
export declare type IQueryParams = {
    [key: string]: boolean | string | undefined;
};
/**
 * Returns a `URL` instance stringified via `.pathname` + `.search` + `.hash`
 *
 * > **NOTE**: Set `include_hash` to `false`, to disable including `.hash` as a postfix
 *
 * ```javascript
 * import {format_url} from "svelte-commons/lib/util/shared";
 *
 * const url = new URL("https://my.domain/path/to/application?x=2#header-id");
 *
 * // Here, we're formating it with all three URL components
 * const format_hash = format_url(url);
 * console.log(format_hash); // logs: `/path/to/application?x=2#header-id`
 *
 * // Optionally though. you can disable including the `.hash` component
 * const format_no_hash = format_url(url, false);
 * console.log(format_no_hash); // logs: `/path/to/application?x=2`
 * ```
 *
 * @param url
 * @param include_hash
 */
export declare function format_url(url: Location | URL, include_hash?: boolean): string;
/**
 * Returns if the `href` is an internal webpage link, e.g. `/path/to/page` or `this/is/a/path`
 *
 * > **RULES**:
 * > - URLs with a protocol, e.g. `https://my.domain/index.html`, are considered external
 * > - URLs that are protocol independent, e.g. `//cdn-provider.com/some_stylesheet.css` are considered external
 *
 * ```javascript
 * import {is_internal_href} from "svelte-commons/lib/util/shared";
 *
 * const href = "/path/to/application?x=1";
 * const url = "https://google.com";
 *
 * console.log(is_internal_href(href)); // logs: `true`
 * console.log(is_internal_href(url)); // logs: `false`
 * ```
 *
 * @param href
 */
export declare function is_internal_href(href: string): boolean;
/**
 * Returns the `a` and `b` URLs joined together naively
 *
 * > **RULES**:
 * > - Protocols, domains, ports are ignored for both URLs
 * > - Hash string, and query parameters are ignored for `a` URL
 * > - `b` URL's hash string and query parameters will be in the resulting URL
 * > - The resulting URL pathname are normalized after being joined
 *
 * ```javascript
 * import {join} from "svelte-commons/lib/util/shared";
 *
 * // We're going to join `a` and `b` together, however the protocol and domain will be
 * // dropped from `a`, along with the query parameters
 * const a = "https://my.domain/path/to/application?x=1";
 * const b = "/sub-page?x=2";
 *
 * const joined = join(a, b);
 *
 * console.log(joined); // logs: `/path/to/application/sub-page?x=2`
 * ```
 *
 * @param a
 * @param b
 */
export declare function join(a: string, b: string): string;
/**
 * Returns the normalized version of the `pathname` parameter
 *
 * > **RULES**:
 * > - Backward slashes `\` are converted to forward slashes `/`
 * > - Consecutive forward slashes `/` are reduced to a single slash
 * > - Forward slashes `/` are trimmed from the beginning and end of the string
 * > - Up directory directives `../` are evaluated, removing it and the parent directory if exists
 * >     - **NOTE**: Parent directories are currently matched to alphanumeric chatacters, periods, spaces, tildes, underscores and dashes
 * >     - **REGEX**: [\w_\.\-\s~]+
 *
 * ```javascript
 * import {normalize_pathname} from "svelte-commons/lib/util/shared";
 *
 * // Below we have a pathname with Windows separators `\`, consecutive separators `//`, and up directory directives `../`
 * const malformed_pathname = "\\path/to//application/src/../assets"; // NOTE: `\\` renders as `\`, since `\` normally escapes in strings
 *
 * const normalized = normalize_pathname(malformed_pathname);
 *
 * console.log(normalized); // logs: `/path/to/application/assets`
 * ```
 *
 * @param pathname
 */
export declare function normalize_pathname(pathname: string): string;
/**
 * Returns a query string parsed into a key-value mapping
 *
 * ```javascript
 * import {parse_query} from "svelte-commons/lib/util/shared";
 *
 * const query_string = "?sorting=ASCENDING&remove-inactive";
 *
 * const mapping = parse_query(query_string);
 *
 * console.log(mapping); logs: `{"sorting": "ASCENDING", "remove-inactive": true}`
 * ```
 *
 * @param query
 */
export declare function parse_query(query: string | URL | URLSearchParams): IQueryParams;
/**
 * Returns a function that matches parameterized routes, returning the assigned values and parsed parameters
 *
 * ```javascript
 * import {make_router} from "svelte-commons/lib/util/shared";
 *
 * import ComponentOne from "...";
 * import ComponentTwo from "...";
 *
 * // Below, we're defining our route mappings, along with their assigned Svelte Components
 * const routes = {
 *     "/": ComponentOne,
 *     "/items/:id": ComponentTwo
 * };
 *
 * // Now we feed our mappings into the factory function, which gives us a matcher function
 * const router = make_router(routes);
 *
 * // First, let's try matching our first route
 * console.log(router("/")); // logs: `[{}, ComponentOne]`
 *
 * // Next, let's try matching our second route
 * console.log(router("/items/blue-jeans")); // logs: `[{id: "blue-jeans"}, ComponentTwo]`
 *
 * // Finally, we can see that if we pass an invalid route, `null` is returned. Which should
 * // be treated the same as a "404"
 * console.log(router("/some/invalid/route")); // logs: `null`
 * ```
 *
 * @param routes
 * @param base
 */
export declare function make_router(routes: IRouterMap, base?: string): IRouter;
