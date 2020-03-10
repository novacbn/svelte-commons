import {comparator_entries, is_falsy} from "./functional";
import {format_dash_key, format_tokens} from "./string";

/**
 * Represents the type mapping used for the `map_*` functions
 */
export type IKeyMap = {[key: string]: any};

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
export function format_css_declaration(key: string, value: any): string {
    key = format_dash_key(key);
    value = value.toString();

    return `${key}:${value}`;
}

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
export function format_css_reference(
    key: string,
    default_value: any = null,
    func: string = "var"
): string {
    key = format_dash_key(key);

    if (default_value) {
        default_value = default_value.toString();
        return `${func}(--${key}, ${default_value})`;
    }

    return `${func}(--${key})`;
}

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
export function format_css_variable(key: string, value: any): string {
    key = format_dash_key(key);
    value = value.toString();

    return `--${key}:${value}`;
}

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
export function map_classes(mapping: IKeyMap, delimiter: string = " "): string {
    let entries = Object.entries(mapping);

    // Classes are NOT sorted, due to CSS specificity. But falsy
    // values still need to be removed, (excluding stuff like zeroes)
    entries = entries.filter(([key, value]) => !is_falsy(value));

    const classes = entries.map(([key, value]) => {
        if (key.includes("%s")) {
            key = format_tokens(key, value);
        }

        return key;
    });

    return classes.join(delimiter);
}

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
export function map_style(mapping: IKeyMap, delimiter: string = ";"): string {
    let entries = Object.entries(mapping);

    // Need to sort entries by key for reproducibility, then remove
    // falsy values, (excluding stuff like zeroes)
    entries.sort(comparator_entries);
    entries = entries.filter(([key, value]) => !is_falsy(value));

    const properties = entries.map(([key, value]) => {
        const declaraton = format_css_declaration(key, value);

        return declaraton + delimiter;
    });

    return properties.join("");
}

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
export function map_variables(mapping: IKeyMap, delimiter: string = ";"): string {
    let entries = Object.entries(mapping);

    // Need to sort entries by key for reproducibility, then remove
    // falsy values, (excluding stuff like zeroes)
    entries.sort(comparator_entries);
    entries = entries.filter(([key, value]) => !is_falsy(value));

    const variables = entries.map(([key, value]) => {
        const variable = format_css_variable(key, value);

        return variable + delimiter;
    });

    return variables.join("");
}
