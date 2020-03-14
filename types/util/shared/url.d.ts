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
 * Returns if the `href` is an internal webpage link, e.g. `/path/to/page` or `this/is/a/path`
 *
 * @internal
 *
 * @param href
 */
export declare function is_internal_url(href: string): boolean;
/**
 * Returns the `a` and `b` paths joined together naively
 * @param a
 * @param b
 */
export declare function join(a: string, b: string): string;
/**
 * Returns a pathname matching function, that returns the named parameters in
 * the given pathname if the route matched
 *
 * @internal
 *
 * @param route
 */
export declare function compile_route(route: string): IRouterMatcher;
/**
 * Returns a pathname matching function
 * @param routes
 */
export declare function make_router(routes: IRouterMap): IRouter;
