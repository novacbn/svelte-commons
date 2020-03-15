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
 * @param pathname
 */
export declare function normalize_pathname(pathname: string): string;
/**
 * Returns a query string parsed into a key-value mapping
 * @param query
 */
export declare function parse_query(query: string | URL | URLSearchParams): IQueryParams;
/**
 * Returns a pathname matching function
 * @param routes
 * @param base
 */
export declare function make_router(routes: IRouterMap, base?: string): IRouter;
