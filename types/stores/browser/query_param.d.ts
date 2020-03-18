import { Writable } from "svelte/store";
/**
 * Represents the options passable into the [[query_param]] Svelte Store
 */
export interface IQueryParamOptions {
    /**
     * Represents if the URL hash should be used as the href source, e.g. `https://my.domain/?x=y` or `https://my.domain/#?x=y`
     */
    hash: boolean;
    /**
     * Represents if updates to the Store should creating a new [History](https://developer.mozilla.org/en-US/docs/Web/API/History_API) entry or not, e.g. back button-able
     */
    replace: boolean;
}
/**
 * Returns a `Writable` Svelte Store, which binds to a specific query string parameter
 *
 * ```javascript
 * <script context="module">
 *     const SORTING_MODES = {
 *         ascending: "ASCENDING",
 *         decending: "DECENDING"
 *     };
 * </script>
 *
 * <script>
 *     import {query_param} from "svelte-commons/lib/stores/browser";
 *
 *     // By providing `SORTING_MODES.ascending` as the default, that means whenever `?sorting=` is missing,
 *     // then the Store will output `ASCENDING`
 *     const store = query_param("sorting", SORTING_MODES.ascending);
 *
 *     const movie_titles = ["Golden Eye", "Blade Runner", "Star Wars: Episode I - The Phantom Menace"];
 *
 *     let sorted;
 *     $: {
 *         sorted = [...movie_titles];
 *         sorted.sort();
 *
 *         if ($store === SORTING_MODES.decending) sorted.reverse();
 *     }
 * </script>
 *
 * <!-- Below will erase `?sorting=` from the URL, since `SORTING_MODES.ascending` is our default -->
 * Change to: <a on:click|preventDefault={() => $store = SORTING_MODES.ascending}>ASCENDING</a><br />
 *
 * <!-- Below will add `?sorting=DECENDING` to the URL -->
 * Change to: <a on:click|preventDefault={() => $store = SORTING_MODES.decending}>DECENDING</a><br />
 *
 * <h2>Movie Titles:</h2>
 *
 * <ul>
 *     {#each sorted as title}
 *         <li>{title}</li>
 *     {/each}
 * </ul>
 * ```
 *
 * @param key
 * @param default_value
 * @param options
 */
export declare function query_param<T = boolean | string>(key: string, default_value: boolean | string, options?: Partial<IQueryParamOptions>): Writable<T>;
