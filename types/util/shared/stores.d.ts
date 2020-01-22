/**
 * NOTE:
 *  Since Svelte doesn't export the direct input / output type
 *  aliases, we need to redefine them below
 */
/**
 *
 */
export declare type IStoreInvalidator<T> = (value?: T) => void;
/**
 *
 */
export declare type IStoreStartStopNotifier<T> = (set: IStoreSubscriber<T>) => IStoreUnsubscriber;
/**
 *
 */
export declare type IStoreSubscriber<T> = (value: T) => void;
/**
 *
 */
export declare type IStoreUnsubscriber = () => void;
/**
 *
 */
export declare type IStoreUpdater<T> = (value: T) => T;
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
export declare function is_readable(value: unknown): boolean;
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
export declare function is_writable(value: unknown): boolean;
