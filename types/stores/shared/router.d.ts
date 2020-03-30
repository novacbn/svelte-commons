import { SvelteComponent } from "svelte/internal";
import { Readable, Writable } from "svelte/store";
import { goto } from "../../util/browser/location";
import { IRouterMap, IRouterParameters, IQueryParams } from "../../util/shared/url";
/**
 * Represents the options passable into the [[router]] Svelte Store
 */
export interface IRouterOptions {
    /**
     * Represents the base url of your Web Application, e.g. if the entry point is `https://my.domain/my-application`, you should set to `/my-application/`
     *
     * **NOTE**: The [[router]] Store also reads from any [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) elements in `<head>`, if present
     */
    base_url: string;
    /**
     * Represents if the URL hash should be used as the href source, e.g. `https://my.domain/path/to/route?x=y` or `https://my.domain/#path/to/route?x=y`
     */
    hash: boolean;
    /**
     * Represents the current / initial href of the [[router]] Store, used on Server to facilitate SSR routing
     *
     * > **NOTE**: This option is ignored on Browsers
     */
    href: string;
}
/**
 * Represents the functions and Stores returned by [[router]], used for programatically interacting with it
 */
export interface IRouterReturn {
    /**
     * Represents a `Readable` Store that outputs the current Component, if there is a matching route
     *
     * **NOTE**: If the Store outputs `undefined`, you should treat that as a 404 error
     */
    component: Readable<SvelteComponent | null>;
    /**
     * Represents a `Readable` (Browser) / `Writable` (Server) Store that outputs the current full href string
     */
    href: Readable<string> | Writable<string>;
    /**
     * Represents a bound [[goto]] function, with its [[IGotoOptions.base_url]] / [[IGotoOptions.hash]] already set
     */
    goto: typeof goto;
    /**
     * Represents a `Readable` Store that outputs a `URL` instance of the current [[IRouterReturn.href]] value
     */
    url: Readable<URL>;
    /**
     * Represents an object of `Readable` Stores relating to the current webpage details
     */
    page: {
        /**
         * Represents a `Readable` Store of the current hostname of a [[router]] instance, usually taken from [[IRouterOptions.url]] or [`Location.host`](https://developer.mozilla.org/en-US/docs/Web/API/Location/host)
         */
        host: Readable<string>;
        /**
         * Represents a `Readable` Store of the current pathname of a [[router]] instance
         */
        path: Readable<string>;
        /**
         * Represents a `Readable` Store of the current parsed URL parameters of a [[router]] instance
         */
        params: Readable<IRouterParameters>;
        /**
         * Represents a `Readable` Store of the current query string, parsed into a key-value mapping, from a [[router]] instance
         */
        query: Readable<IQueryParams>;
    };
}
/**
 * Returns a new [[IRouterReturn]] object, which contains Stores and utility functions for getting details about the current router state, and navigation
 *
 * For your basic Web Application that has a Web Server configured to route all traffic to `/index.html`:
 *
 * ```html
 * <script>
 *     import {router} from "svelte-commons/lib/stores/shared";
 *
 *     import Error404 from "./routes/_404.svelte";
 *
 *     import Home from "./routes/Index.svelte";
 *     import About from "./routes/About.svelte";
 *
 *     import Blog from "./routes/blog/Index.svelte";
 *     import BlogPost from "./routes/blog/posts/Index.svelte";
 *
 *     // Below declares our `Route -> Svelte Component` mapping, which uses the common
 *     // `/path/to/view/:parameter` pattern format
 *     const routes = {
 *         "/": Home,
 *         "/about": About
 *
 *         "/blog": Blog,
 *         "/blog/:id": BlogPost
 *     };
 *
 *     // The `router` Store returns us an `IRouteReturn` instance, which has our current router state
 *     // and functions. It vaguely resembles the API of Sapper, with some extra goodies
 *     const {component, goto, page} = router(routes);
 *     const {params, query} = page;
 *
 *     function on_click(event) {
 *         goto(event.target.href);
 *     }
 * </script>
 *
 * <nav>
 *     <!--
 *         We need to hijack our link anchors to pass through the returned `goto`
 *         function, that way we can avoid full page navigations
 *     -->
 *     <a href="/" on:click|preventDefault={on_click}>Home</a>
 *     <a href="/about" on:click|preventDefault={on_click}>About</a>
 *     <a href="/blog" on:click|preventDefault={on_click}>Blog</a>
 * </nav>
 *
 * <main>
 *     <!-- The `component` Store returns Svelte Component that matches the current route -->
 *     {#if $component}
 *         <!-- Using the `svelte:component` Component Directive, we render the route and pass in the available URL parameters and query params  -->
 *         <svelte:component this={$component} params={$params} query={$query} />
 *     {:else}
 *         <!-- If no matching route was matched, treat as a 404 -->
 *         <Error404 />
 *     {/if}
 * </main>
 * ```
 *
 * Alternatively, if SSR (Server-Side Rendering) or other Server-oriented interactions are not in your scope, you can enable [[IRouterOptions.hash]] for hash mode:
 *
 * ```html
 * <script>
 *     import {router} from "svelte-commons/lib/stores/shared";
 *
 *     import Error404 from "./routes/_404.svelte";
 *
 *     import Home from "./routes/Index.svelte";
 *     import About from "./routes/About.svelte";
 *
 *     import Blog from "./routes/blog/Index.svelte";
 *     import BlogPost from "./routes/blog/posts/Index.svelte";
 *
 *     const routes = {
 *         "/": Home,
 *         "/about": About
 *
 *         "/blog": Blog,
 *         "/blog/:id": BlogPost
 *     };
 *
 *     // Passing in `IRouterReturn.hash` enables hash mode
 *     const {component, page} = router(routes, {hash: true});
 *     const {params, query} = page;
 * </script>
 *
 * <nav>
 *     <!--
 *         Below, we don't need to hijack click events anymore. Since hash
 *         links don't make the Browser do full-page navigations
 *     -->
 *     <a href="#/">Home</a>
 *     <a href="#/about">About</a>
 *     <a href="#/blog">Blog</a>
 * </nav>
 *
 * <main>
 *     <!-- The rest of the layout template is exactly the same as our non-hash mode version -->
 *     {#if $component}
 *         <svelte:component this={$component} params={$params} query={$query} />
 *     {:else}
 *         <Error404 />
 *     {/if}
 * </main>
 * ```
 *
 * And for SSR implementors, just pass in the current Server URL to [[IRouterOptions.href]] for the `router` Store to work:
 *
 * ```html
 * <script>
 *     import {router} from "svelte-commons/lib/stores/shared";
 *
 *     // We'll expose the current URL href to the rest of our SSR framework, so it can just do:
 *     // `const ret = App.render({href: "https://my.domain/blog/javascript-frameworks-the-good-and-bad"})`
 *     export let href = "";
 *
 *     // Using the same `router` API as before, we just need to pass in `IRouterOptions.href`
 *     const ret = router(..., {href});
 * </script>
 * ```
 *
 * @param routes
 * @param options
 */
export declare function router(routes: IRouterMap, options: Partial<IRouterOptions>): IRouterReturn;
