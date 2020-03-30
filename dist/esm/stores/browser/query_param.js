import { get_location_url } from "../../util/browser/location";
import { overlay } from "../shared/overlay";
import { search } from "./location";
/**
 * Returns the options passable into the [[query_param]] Svelte Store, with standard defaults
 *
 * @internal
 *
 * @param options
 */
function QueryParamOptions(options) {
    if (options === void 0) { options = {}; }
    var _a = options.hash, hash = _a === void 0 ? false : _a, _b = options.replace, replace = _b === void 0 ? false : _b;
    return { hash: hash, replace: replace };
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
export function query_param(key, default_value, options) {
    if (options === void 0) { options = {}; }
    var _a = QueryParamOptions(options), hash = _a.hash, replace = _a.replace;
    var store = search({ hash: hash, replace: replace });
    return overlay(store, 
    // @ts-ignore
    function (value) {
        var params = new URLSearchParams(value);
        // If the end-developer specified that the query parameter was a boolean, only the existance of the key should be returned
        if (typeof default_value === "boolean")
            return params.has(key);
        // If the query parameter is a string, and it is not set, return the default
        if (params.has(key))
            return params.get(key);
        return default_value;
    }, function (value) {
        var url = get_location_url(hash);
        var params = url.searchParams;
        if (typeof default_value === "boolean") {
            // If the end-developer specified that the query parameter was a boolean, then we need to set if truthy
            if (value)
                params.set(key, "");
            else
                params.delete(key);
        }
        else {
            // If the query parameter is a string, then we set it, if the string is not empty or doesn't equal default
            if (!value || value === default_value)
                params.delete(key);
            else
                params.set(key, value);
        }
        // HACK: When boolean query parameters are set via `URLSearchParams.set`, they render as `?my_key=`, but we expect
        // rendering as `?my_key`. So we need to fix that
        return params
            .toString()
            .replace(/=&/g, "&")
            .replace(/=$/g, "");
    });
}
//# sourceMappingURL=query_param.js.map