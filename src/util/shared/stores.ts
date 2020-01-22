/**
 * NOTE:
 *  Since Svelte doesn't export the direct input / output type
 *  aliases, we need to redefine them below
 */

/**
 *
 */
export type IStoreInvalidator<T> = (value?: T) => void;

/**
 *
 */
export type IStoreStartStopNotifier<T> = (set: IStoreSubscriber<T>) => IStoreUnsubscriber;

/**
 *
 */
export type IStoreSubscriber<T> = (value: T) => void;

/**
 *
 */
export type IStoreUnsubscriber = () => void;

/**
 *
 */
export type IStoreUpdater<T> = (value: T) => T;

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
export function is_readable(value: unknown): boolean {
    // @ts-ignore
    return typeof value === "object" && typeof value.subscribe === "function";
}

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
export function is_writable(value: unknown): boolean {
    return (
        // @ts-ignore
        typeof value === "object" &&
        // @ts-ignore
        typeof value.set === "function" &&
        // @ts-ignore
        typeof value.subscribe === "function" &&
        // @ts-ignore
        typeof value.update === "function"
    );
}
