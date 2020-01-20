/**
 * Represents the lookup map returned by `make_array_lookup` / `make_object_lookup`
 */
export declare type ILookupMap = {
    [key: string]: boolean;
};
/**
 * Returns true if the passed in `value` is `false`, `undefined`, or `null`
 * @param value
 */
export declare function is_falsy(value: any): boolean;
/**
 * Returns a lookup map of the supplied `object`
 *
 * e.g.
 * ```json
 * [
 *  "my_value_one",
 *  "my_value_two"
 * ]
 * ```
 *
 * becomes:
 * ```json
 * {
 *  "my_value_one": true,
 *  "my_value_two": true
 * }
 * ```
 * @param array
 * @param blacklist
 */
export declare function make_array_lookup(array: string[], blacklist?: string[]): ILookupMap;
/**
 * Returns a lookup map of the supplied `object`
 *
 * e.g.
 * ```json
 * {
 *  "my_key_one": "...some value...",
 *  "my_key_two": "...some value..."
 * }
 * ```
 *
 * becomes:
 * ```json
 * {
 *  "my_key_one": true,
 *  "my_key_two": true
 * }
 * ```
 * @param object
 * @param blacklist
 */
export declare function make_object_lookup(object: {
    [key: string]: any;
}, blacklist?: string[]): ILookupMap;
