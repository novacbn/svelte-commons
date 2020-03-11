"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the text with delimiters (_, ., [A-Z], spaces) replaced with dashes `-`, also deduplicates consecutive delimiters
 *
 * ```typescript
 * import {format_dash_key} from "svelte-commons/lib/util/shared";
 *
 * const text = "This is a KeyYep";
 * const key = format_dash_key(text);
 *
 * console.log(key); // logs: `this-is-a-key-yep`
 * ```
 *
 * @param {*} text
 */
function format_dash_key(text) {
    text = text
        .replace(/_/g, "-")
        .replace(/\./g, "-")
        .replace(/\s/g, "-")
        .replace(/[A-Z]/g, function (letter, index) {
        if (index > 0)
            return "-" + letter.toLowerCase();
        return letter.toLowerCase();
    });
    while (true) {
        var replaced = text.replace(/\-\-/g, "-");
        if (replaced === text)
            break;
        text = replaced;
    }
    return text;
}
exports.format_dash_key = format_dash_key;
/**
 * Returns the pattern with the token delimiter `%s`, with the spread arguments `tokens`
 *
 * ```typescript
 * import {format_tokens} from "svelte-commons/lib/util/shared";
 *
 * const pattern = "My name is %s! How are you, %s?";
 * const formatted = format_tokens(pattern, "Jeff", "Karen");
 *
 * console.log(formatted); // logs: `My name is Jeff! How are you, Karen?`
 * ```
 *
 * @param pattern
 * @param tokens
 */
function format_tokens(pattern) {
    var tokens = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        tokens[_i - 1] = arguments[_i];
    }
    var index = 0;
    return pattern.replace(/%s/g, function () {
        var token = tokens[index];
        token = token.toString();
        index += 1;
        return token;
    });
}
exports.format_tokens = format_tokens;
//# sourceMappingURL=string.js.map