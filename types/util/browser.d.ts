/**
 * Represents if the current context of the code is running in Browser
 */
export declare const IS_BROWSER: boolean;
/**
 * Returns an object mapping of the current `location.search` value
 * NOTE: Set `hash_mode` to `true` for hash-based routing systems
 * @param hash_mode
 */
export declare function get_query_params(hash_mode?: boolean): {
    [key: string]: boolean | string;
};
/**
 * Updates the current `location.search` with the `*.toString()` values from a `params` mapping
 * NOTE: Set `hash_mode` to `true` for hash-based routing systems
 * NOTE: Mapped values set to `undefined` / `""` / `false`, they will be deleted from the query string instead
 * @param params
 * @param hash_mode
 */
export declare function update_query_params(params: {
    [key: string]: boolean | string | undefined;
}, hash_mode?: boolean): void;
