"use strict";
/**
 * NOTE:
 *  Since Svelte doesn't export the direct input / output type
 *  aliases, we need to redefine them below
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns if the `value` matches a `Readable` Svelte Store implementation
 */
function is_readable(value) {
    // @ts-ignore
    return typeof value === "object" && typeof value.subscribe === "function";
}
exports.is_readable = is_readable;
/**
 * Returns if the `value` matches a `Writable` Svelte Store implementation
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
//# sourceMappingURL=store.js.map