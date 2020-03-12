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
export declare function format_dash_key(text: string): string;
/**
 * Returns the pattern with the token delimiter `%s` replaced, with the spread arguments `tokens`
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
export declare function format_tokens(pattern: string, ...tokens: any[]): string;
