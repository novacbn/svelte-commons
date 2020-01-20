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
 * Returns a pathname matching function, that returns the named parameters in
 * the given pathname if the route matched
 * @param route
 */
export declare function compile_route(route: string): IRouterMatcher;
/**
 * Returns a pathname matching function
 * @param routes
 */
export declare function make_router(routes: IRouterMap): IRouter;
