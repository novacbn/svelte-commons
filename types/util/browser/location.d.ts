/**
 * Returns an object mapping of the current `location.search` value
 * NOTE: Set `hash` to `true` for hash-based routing systems
 * @param hash
 */
export declare function get_query_params(hash?: boolean): {
    [key: string]: boolean | string;
};
/**
 * Returns the current URL based on `Location`
 * NOTE: Set `hash` to `true`, to use `location.hash` as the source instead
 * @param hash
 */
export declare function get_url(hash?: boolean): URL;
/**
 * Sets the current url
 * NOTE: Set `hash` to `true`, to update `location.hash` as a proper URL
 * @param url
 * @param hash
 * @param push_state
 * @param state
 */
export declare function update_url(url: URL, hash?: boolean, push_state?: boolean, state?: any): void;
/**
 * Updates the current `location.search` with the `*.toString()` values from a `params` mapping
 * NOTE: Set `hash` to `true` for hash-based routing systems
 * NOTE: Mapped values set to `undefined` / `""` / `false`, they will be deleted from the query string instead
 * @param params
 * @param hash_mode
 */
export declare function update_query_params(params: {
    [key: string]: boolean | string | undefined;
}, hash?: boolean): void;
