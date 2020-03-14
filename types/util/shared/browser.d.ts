/**
 * Represents the type mapping used for the `map_*` functions
 */
export declare type IKeyMap = {
    [key: string]: any;
};
/**
 * Represents the object with defaults allowed to be used via `make_memory_storage`
 */
export declare type IStorageDefaults = {
    [key: string]: string;
};
/**
 * Represents if the current context is in-Browser
 */
export declare const IS_BROWSER: boolean;
/**
 * Returns the `key` and `value` stringified to a CSS Property Declaration, e.g. `color:red`
 *
 * ```typescript
 * import {format_css_declaration} from "svelte-commons/lib/util/shared";
 *
 * const key = "color";
 * const value = "red";
 *
 * const declaration = format_css_declaration(key, value);
 *
 * console.log(declaration); // logs: `color:red`
 * ```
 *
 * @param key
 * @param value
 */
export declare function format_css_declaration(key: string, value: any): string;
/**
 * Returns the `key` stringified into a CSS Variable reference, e.g. `var(--primary-color)`
 *
 * ```typescript
 * import {format_css_reference} from "svelte-commons/lib/util/shared";
 *
 * const key = "primary-color";
 * const default_value = "blue";
 *
 * const reference = format_css_reference(key, default_value);
 *
 * console.log(reference); // logs: `var(--primary-color, blue)`
 * ```
 *
 * @param key
 * @param default_value
 * @param func
 */
export declare function format_css_reference(key: string, default_value?: any, func?: string): string;
/**
 * Returns the `key` and `value` stringified into a CSS Variable Declaration, e.g. `--primary-color:red`
 *
 * ```typescript
 * import {format_css_variable} from "svelte-commons/lib/util/shared";
 *
 * const key = "primary-color";
 * const value = "red";
 *
 * const variable = format_css_variable(key, value);
 *
 * console.log(variable); // logs: `--primary-color:red`
 * ```
 *
 * @param key
 * @param value
 */
export declare function format_css_variable(key: string, value: any): string;
/**
 * Represents an in-memory reimplementation of a [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage)
 *
 * ```javascript
 * import {make_memory_storage} from "svelte-commons/lib/util/shared";
 *
 * const storage = make_memory_storage();
 *
 * // Save data to Storage
 * storage.setItem("key", "value");
 *
 * // Get saved data from Storage
 * let data = storage.getItem("key");
 *
 * // Remove saved data from Storage
 * storage.removeItem("key");
 *
 * // Remove all saved data from Storage
 * storage.clear();
 * ```
 *
 * @param default_value
 */
export declare function make_memory_storage(default_value: IStorageDefaults): Storage;
/**
 * Returns a key-value mapping of CSS Classes transformed into a single spaced ` ` string, e.g. `btn btn-primary`
 *
 * ```typescript
 * import {map_classes} from "svelte-commons/lib/util/shared";
 *
 * const data = {
 *     btn: "true",
 *     "btn-%s": "primary",
 *     btn_outline: false
 * };
 *
 * const classes = map_classes(data);
 *
 * console.log(classes); // logs: `btn btn-primary`
 * ```
 *
 * @param mapping
 * @param delimiter
 */
export declare function map_classes(mapping: IKeyMap, delimiter?: string): string;
/**
 * Returns a key-value mapping of CSS Properties transformed into a single semi-colon `;` string, e.g. `background-color:black;color:white;`
 *
 * ```typescript
 * import {map_style} from "svelte-commons/lib/util/shared";
 *
 * const data = {
 *     background_color: "white",
 *     color: "black"
 * };
 *
 * const style = map_style(data);
 *
 * console.log(style); // logs: `background-color:white;color:black;`
 * ```
 *
 * @param mapping
 * @param delimiter
 */
export declare function map_style(mapping: IKeyMap, delimiter?: string): string;
/**
 * Returns a key-value mapping of CSS Variables transformed into a single semi-colon `;` string, e.g. `--background:black;--foreground:white;`
 *
 * ```typescript
 * import {map_variables} from "svelte-commons/lib/util/shared";
 *
 * const data = {
 *     theme_background: "white",
 *     theme_foreground: "black"
 * };
 *
 * const variables = map_variables(data);
 *
 * console.log(variables); // logs: `--theme-background:white;--theme-foreground:black;`
 * ```
 *
 * @param mapping
 * @param delimiter
 */
export declare function map_variables(mapping: IKeyMap, delimiter?: string): string;
