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
 * Returns the normalized version of the `pathname` string (via `URL`)
 *
 * @internal
 *
 * @param pathname
 */
function normalize_pathname(pathname: string): string {
    return new URL(pathname, "http://localhost").pathname;
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
 * Returns a pathname matching function, that returns the named parameters in
 * the given pathname if the route matched
 *
 * @internal
 *
 * @param route
 */
export function compile_route(route: string): IRouterMatcher {
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
 * Returns a pathname matching function
 * @param routes
 */
export function make_router(routes: IRouterMap): IRouter {
    // source: https://stackoverflow.com/a/40739605
    let route_entries = Object.entries(routes);
    route_entries = route_entries.sort(sort_routes);

    const compiled_routes: [string, IRouterMatcher, SvelteComponent][] = route_entries.map(
        ([route, Component]) => {
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
