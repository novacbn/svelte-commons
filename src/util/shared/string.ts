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
export function format_dash_key(text: string): string {
    text = text
        .replace(/_/g, "-")
        .replace(/\./g, "-")
        .replace(/\s/g, "-")
        .replace(/[A-Z]/g, (letter, index) => {
            if (index > 0) return "-" + letter.toLowerCase();
            return letter.toLowerCase();
        });

    while (true) {
        const replaced = text.replace(/\-\-/g, "-");
        if (replaced === text) break;

        text = replaced;
    }

    return text;
}

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
export function format_tokens(pattern: string, ...tokens: any[]): string {
    let index = 0;

    return pattern.replace(/%s/g, () => {
        let token = tokens[index];
        token = token.toString();

        index += 1;

        return token;
    });
}
