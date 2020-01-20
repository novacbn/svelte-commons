/**
 * @packageDocumentation
 * @hidden
 */

import {get_current_origin, get_current_url} from "../shared";

/**
 * Updates the current search string
 * NOTE: Set `hash` to `true`, to update `location.hash` as a proper URL
 *
 * @internal
 *
 * @param search
 * @param hash
 * @param push_state
 * @param state
 */
function update_search(
    search: URLSearchParams,
    hash: boolean = false,
    push_state: boolean = false,
    state: any = history.state
): void {
    const url = get_url(hash);
    url.search = search.toString();

    update_url(url, hash, push_state, state);
}

/**
 * Returns an object mapping of the current `location.search` value
 * NOTE: Set `hash` to `true` for hash-based routing systems
 *
 * @internal
 *
 * @param hash
 */
export function get_query_params(hash: boolean = false): {[key: string]: boolean | string} {
    const search = get_url(hash).searchParams;
    const params: {[key: string]: boolean | string} = {};

    for (const [key, value] of search.entries()) {
        params[key] = value ? value : true;
    }

    return params;
}

/**
 * Returns the current URL based on `Location`
 * NOTE: Set `hash` to `true`, to use `location.hash` as the source instead
 *
 * @internal
 *
 * @param hash
 */
export function get_url(hash: boolean = false): URL {
    // NOTE: We need to be able to support the current context's
    // set URL. That way we can run properly in SSR mode
    const url = get_current_url();

    if (hash) return new URL(url.hash.slice(1), get_current_origin());
    return url;
}

/**
 * Sets the current url
 * NOTE: Set `hash` to `true`, to update `location.hash` as a proper URL
 *
 * @internal
 *
 * @param url
 * @param hash
 * @param push_state
 * @param state
 */
export function update_url(
    url: URL,
    hash: boolean = false,
    push_state: boolean = false,
    state: any = history.state
): void {
    const updater = push_state ? "pushState" : "replaceState";

    // Want to make sure empty pathnames are just removed from the
    // hash string entirely
    let {pathname} = url;
    if (pathname === "/") pathname = "";

    let href = `${pathname}${url.search}${url.hash}`;
    if (hash) href = `${location.pathname}${location.search}` + (href ? "#" + href : "");

    history[updater](state, "", href);
}

/**
 * Updates the current `location.search` with the `*.toString()` values from a `params` mapping
 * NOTE: Set `hash` to `true` for hash-based routing systems
 * NOTE: Mapped values set to `undefined` / `""` / `false`, they will be deleted from the query string instead
 *
 * @internal
 *
 * @param params
 * @param hash_mode
 */
export function update_query_params(
    params: {[key: string]: boolean | string | undefined},
    hash: boolean = false
): void {
    const search = get_url(hash).searchParams;

    for (const key in params) {
        const value = params[key];

        if (typeof value === "undefined" || value === "" || value === false) search.delete(key);
        else search.set(key, value.toString());
    }

    update_search(search, hash);
}
