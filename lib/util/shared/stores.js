"use strict";
/**
 * NOTE:
 *  Since Svelte doesn't export the direct input / output type
 *  aliases, we need to redefine them below
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns if the `value` matches a `Readable` Svelte Store implementation
 *
 * As a minimal example:
 *
 * ```javascript
 * import {readable, writable} from "svelte/store";
 *
 * import {is_readable} from "svelte-commons/lib/util/shared";
 *
 * const readable_store = readable("some value");
 * const writable_store = writable("some value");
 *
 * console.log(
 *     is_readable(readable_store),
 *     is_readable(writable_store)
 * ); // logs: `true`, `true`
 * ```
 */
function is_readable(value) {
    // @ts-ignore
    return typeof value === "object" && typeof value.subscribe === "function";
}
exports.is_readable = is_readable;
/**
 * Returns if the `value` matches a `Writable` Svelte Store implementation
 *
 * As a minimal example:
 *
 * ```javascript
 * import {readable, writable} from "svelte/store";
 *
 * import {is_writable} from "svelte-commons/lib/util/shared";
 *
 * const readable_store = readable("some value");
 * const writable_store = writable("some value");
 *
 * console.log(
 *     is_writable(readable_store),
 *     is_writable(writable_store)
 * ); // logs: `false`, `true`
 * ```
 *
 * @param value
 */
function is_writable(value) {
    return (
    // @ts-ignore
    typeof value === "object" &&
        // @ts-ignore
        typeof value.set === "function" &&
        // @ts-ignore
        typeof value.subscribe === "function" &&
        // @ts-ignore
        typeof value.update === "function");
}
exports.is_writable = is_writable;
//# sourceMappingURL=stores.js.map