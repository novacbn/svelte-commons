import {SvelteComponent} from "svelte/internal";

/**
 * Represents the Regular Expression to match patterns in route patterns, e.g. `/my/route/:parameter/:names`
 *
 * @internal
 */
const ROUTE_PARAMETER_EXPRESSION = /:[^\s/]+/g;

/**
 * Represents the matching function returned by `make_router`
 */
export type IRouter = (pathname: string) => [IRouterParameters, SvelteComponent] | null;

/**
 * Represents a set of parsed route pattern parameters
 */
export type IRouterParameters = {[key: string]: string | undefined};

/**
 * Represents the matching function returned by `compile_route`
 */
export type IRouterMatcher = (pathname: string) => IRouterParameters | null;

/**
 * Represents a route pattern -> Svelte Component mapping
 */
export interface IRouterMap {
    [key: string]: SvelteComponent;
}

/**
 * Represents the key-value mapping returned by [[parse_query]]
 */
export type IQueryParams = {[key: string]: boolean | string | undefined};

/**
 * Returns a pathname matching function, that returns the named parameters in
 * the given pathname if the route matched
 *
 * @internal
 *
 * @param route
 */
function compile_route(route: string): IRouterMatcher {
    // source: https://stackoverflow.com/a/40739605
    route = normalize_pathname(route);

    const parameters: string[] = [];
    const expression = new RegExp(
        "^" + route.replace(ROUTE_PARAMETER_EXPRESSION, "([\\w-]+)") + "$"
    );

    // We need to collect the parameters name from the route pattern in order,
    // so the matching function return the parsed pathnames as named keys
    let match;
    while ((match = ROUTE_PARAMETER_EXPRESSION.exec(route))) {
        parameters.push(match[0].slice(1));
    }

    return (pathname) => {
        pathname = normalize_pathname(pathname);

        const match = expression.exec(pathname);
        if (match) {
            const _parameters: IRouterParameters = {};
            for (const index in parameters) {
                // `RegExp.exec` returns the matched value as index `0`,
                // so we need to increment by `1`
                _parameters[parameters[index]] = match[parseInt(index) + 1];
            }

            return _parameters;
        }

        return null;
    };
}

/**
 * Returns the sorting for route patterns, sorting longer (more specific) patterns
 * higher than shorter (less specific) patterns
 *
 * @internal
 *
 * @param a
 * @param b
 */
function sort_routes(a: [string, SvelteComponent], b: [string, SvelteComponent]) {
    return b[0].length - a[0].length;
}

/**
 * Returns a `URL` instance stringified via `.pathname` + `.search` + `.hash`
 *
 * > **NOTE**: Set `include_hash` to `false`, to disable including `.hash` as a postfix
 *
 * @param url
 * @param include_hash
 */
export function format_url(url: Location | URL, include_hash: boolean = true): string {
    const {hash, pathname, search} = url;

    if (include_hash) return pathname + search + hash;
    return pathname + search;
}

/**
 * Returns if the `href` is an internal webpage link, e.g. `/path/to/page` or `this/is/a/path`
 *
 * > **RULES**:
 * > - URLs with a protocol, e.g. `https://my.domain/index.html`, are considered external
 * > - URLs that are protocol independent, e.g. `//cdn-provider.com/some_stylesheet.css` are considered external
 *
 * @param href
 */
export function is_internal_href(href: string): boolean {
    return !href.match(/^\w+:\/\//) && !href.startsWith("//");
}

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
export function join(a: string, b: string): string {
    let {pathname: a_pathname} = new URL(a, "http://localhost");
    let {hash, search, pathname: b_pathname} = new URL(b, "http://localhost");

    return normalize_pathname(a_pathname + "/" + b_pathname) + search + hash;
}

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
export function normalize_pathname(pathname: string): string {
    return pathname
        .replace(/\\+/g, "/")
        .replace(/[\/\/]+/g, "/")
        .replace(/([\w_\.\-\s~]+\/)?(\.\.\/)/g, "")
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
}

/**
 * Returns a query string parsed into a key-value mapping
 * @param query
 */
export function parse_query(query: string | URL | URLSearchParams): IQueryParams {
    if (typeof query === "string") query = new URLSearchParams(query);
    else if (query instanceof URL) query = query.searchParams;

    const entries: [string, boolean | string][] = Array.from(query.entries(), ([key, value]) => {
        // Since boolean query parameters, e.g. `?x=` / `?x`, have no value, we need to them to `true`
        if (value) return [key, value];
        return [key, true];
    });

    // NOTE: Just to increase supported Browsers, e.g. pre-Chromium Microsoft Edge, using a `.reduce` instead of `Object.fromEntries`
    return entries.reduce<IQueryParams>((accum, [key, value]) => {
        accum[key] = value;

        return accum;
    }, {});
}

/**
 * Returns a pathname matching function
 * @param routes
 * @param base
 */
export function make_router(routes: IRouterMap, base: string = ""): IRouter {
    // source: https://stackoverflow.com/a/40739605
    let route_entries = Object.entries(routes);
    route_entries = route_entries.sort(sort_routes);

    const compiled_routes: [string, IRouterMatcher, SvelteComponent][] = route_entries.map(
        ([route, Component]) => {
            // Add support for end-developers passing a base URL, e.g. `https://my.domain/path/to/application`
            if (base) route = join(base, route);
            const match = compile_route(route);

            return [route, match, Component];
        }
    );

    return (pathname: string) => {
        for (const [route, match, Component] of compiled_routes) {
            const parameters = match(pathname);
            if (parameters) return [parameters, Component];
        }

        return null;
    };
}
