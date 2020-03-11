"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var functional_1 = require("./functional");
var string_1 = require("./string");
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
function format_css_declaration(key, value) {
    key = string_1.format_dash_key(key);
    value = value.toString();
    return key + ":" + value;
}
exports.format_css_declaration = format_css_declaration;
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
function format_css_reference(key, default_value, func) {
    if (default_value === void 0) { default_value = null; }
    if (func === void 0) { func = "var"; }
    key = string_1.format_dash_key(key);
    if (default_value) {
        default_value = default_value.toString();
        return func + "(--" + key + ", " + default_value + ")";
    }
    return func + "(--" + key + ")";
}
exports.format_css_reference = format_css_reference;
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
function format_css_variable(key, value) {
    key = string_1.format_dash_key(key);
    value = value.toString();
    return "--" + key + ":" + value;
}
exports.format_css_variable = format_css_variable;
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
function map_classes(mapping, delimiter) {
    if (delimiter === void 0) { delimiter = " "; }
    var entries = Object.entries(mapping);
    // Classes are NOT sorted, due to CSS specificity. But falsy
    // values still need to be removed, (excluding stuff like zeroes)
    entries = entries.filter(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        return !functional_1.is_falsy(value);
    });
    var classes = entries.map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if (key.includes("%s")) {
            key = string_1.format_tokens(key, value);
        }
        return key;
    });
    return classes.join(delimiter);
}
exports.map_classes = map_classes;
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
function map_style(mapping, delimiter) {
    if (delimiter === void 0) { delimiter = ";"; }
    var entries = Object.entries(mapping);
    // Need to sort entries by key for reproducibility, then remove
    // falsy values, (excluding stuff like zeroes)
    entries.sort(functional_1.comparator_entries);
    entries = entries.filter(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        return !functional_1.is_falsy(value);
    });
    var properties = entries.map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        var declaraton = format_css_declaration(key, value);
        return declaraton + delimiter;
    });
    return properties.join("");
}
exports.map_style = map_style;
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
function map_variables(mapping, delimiter) {
    if (delimiter === void 0) { delimiter = ";"; }
    var entries = Object.entries(mapping);
    // Need to sort entries by key for reproducibility, then remove
    // falsy values, (excluding stuff like zeroes)
    entries.sort(functional_1.comparator_entries);
    entries = entries.filter(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        return !functional_1.is_falsy(value);
    });
    var variables = entries.map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        var variable = format_css_variable(key, value);
        return variable + delimiter;
    });
    return variables.join("");
}
exports.map_variables = map_variables;
//# sourceMappingURL=browser.js.map