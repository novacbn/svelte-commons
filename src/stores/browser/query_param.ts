import {Writable} from "svelte/store";

import {get_location_url} from "../../util/browser/location";

import {overlay} from "../shared/overlay";

import {search} from "./location";

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
 * Returns the options passable into the [[query_param]] Svelte Store, with standard defaults
 *
 * @internal
 *
 * @param options
 */
function QueryParamOptions(options: Partial<IQueryParamOptions> = {}): IQueryParamOptions {
    const {hash = false, replace = false} = options;

    return {hash, replace};
}

/**
 * Returns a `Writable` Svelte Store, which binds to a specific query string parameter
 *
 * ```html
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
export function query_param<T = boolean | string>(
    key: string,
    default_value: boolean | string,
    options: Partial<IQueryParamOptions> = {}
): Writable<T> {
    const {hash, replace} = QueryParamOptions(options);
    const store = search({hash, replace}) as Writable<string>;

    return overlay(
        store,
        // @ts-ignore
        (value) => {
            const params = new URLSearchParams(value);

            // If the end-developer specified that the query parameter was a boolean, only the existance of the key should be returned
            if (typeof default_value === "boolean") return params.has(key);

            // If the query parameter is a string, and it is not set, return the default
            if (params.has(key)) return params.get(key);
            return default_value;
        },

        (value) => {
            const url = get_location_url(hash);
            const params = url.searchParams;

            if (typeof default_value === "boolean") {
                // If the end-developer specified that the query parameter was a boolean, then we need to set if truthy
                if (value) params.set(key, "");
                else params.delete(key);
            } else {
                // If the query parameter is a string, then we set it, if the string is not empty or doesn't equal default
                if (!value || value === default_value) params.delete(key);
                else params.set(key, value);
            }

            // HACK: When boolean query parameters are set via `URLSearchParams.set`, they render as `?my_key=`, but we expect
            // rendering as `?my_key`. So we need to fix that
            return params
                .toString()
                .replace(/=&/g, "&")
                .replace(/=$/g, "");
        }
    );
}
