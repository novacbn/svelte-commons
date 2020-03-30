var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { comparator_entries, is_falsy } from "./functional";
import { format_dash_key, format_tokens } from "./string";
/**
 * Represents if the current context is in-Browser
 */
export var IS_BROWSER = typeof window !== "undefined";
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
export function format_css_declaration(key, value) {
    key = format_dash_key(key);
    value = value.toString();
    return key + ":" + value;
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
export function format_css_reference(key, default_value, func) {
    if (default_value === void 0) { default_value = null; }
    if (func === void 0) { func = "var"; }
    key = format_dash_key(key);
    if (default_value) {
        default_value = default_value.toString();
        return func + "(--" + key + ", " + default_value + ")";
    }
    return func + "(--" + key + ")";
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
export function format_css_variable(key, value) {
    key = format_dash_key(key);
    value = value.toString();
    return "--" + key + ":" + value;
}
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
export function make_memory_storage(default_value) {
    var storage;
    if (default_value) {
        var entries = Object.entries(default_value);
        storage = new Map(entries);
    }
    else
        storage = new Map();
    return {
        length: storage.size,
        clear: function () {
            storage.clear();
        },
        getItem: function (key) {
            if (storage.has(key))
                return storage.get(key);
            return null;
        },
        key: function (index) {
            var keys = Array.from(storage.keys());
            return keys[index];
        },
        removeItem: function (key) {
            storage.delete(key);
            // @ts-ignore
            this.length = storage.size;
        },
        setItem: function (key, value) {
            value = value.toString();
            storage.set(key, value);
            // @ts-ignore
            this.length = storage.size;
        }
    };
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
export function map_classes(mapping, delimiter) {
    if (delimiter === void 0) { delimiter = " "; }
    var entries = Object.entries(mapping);
    // Classes are NOT sorted, due to CSS specificity. But falsy
    // values still need to be removed, (excluding stuff like zeroes)
    entries = entries.filter(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        return !is_falsy(value);
    });
    var classes = entries.map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
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
export function map_style(mapping, delimiter) {
    if (delimiter === void 0) { delimiter = ";"; }
    var entries = Object.entries(mapping);
    // Need to sort entries by key for reproducibility, then remove
    // falsy values, (excluding stuff like zeroes)
    entries.sort(comparator_entries);
    entries = entries.filter(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        return !is_falsy(value);
    });
    var properties = entries.map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        var declaraton = format_css_declaration(key, value);
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
export function map_variables(mapping, delimiter) {
    if (delimiter === void 0) { delimiter = ";"; }
    var entries = Object.entries(mapping);
    // Need to sort entries by key for reproducibility, then remove
    // falsy values, (excluding stuff like zeroes)
    entries.sort(comparator_entries);
    entries = entries.filter(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        return !is_falsy(value);
    });
    var variables = entries.map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        var variable = format_css_variable(key, value);
        return variable + delimiter;
    });
    return variables.join("");
}
//# sourceMappingURL=browser.js.map