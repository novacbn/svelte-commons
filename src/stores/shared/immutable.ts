import {Readable, Writable, derived, writable} from "svelte/store";

import {IStoreStartStopNotifier, is_readable, is_writable} from "../../util/shared/stores";

import {overlay} from "./overlay";

/**
 * Represents the "cloner" function that returns a clone of the input
 */
export type ICloner<T> = (value: T) => T;

/**
 * Returns a shallow clone of the `value` object
 *
 * **NOTE**: Only `object` or `Array` types are supported
 *
 * @param value
 */
function clone_value(value: any): any {
    if (Array.isArray(value)) return [...value];
    return {...value};
}

/**
 * Returns a `Readable` / `Writable` Svelte Store, that clones the stored value before every I/O operation, to prevent untracked data mutations
 *
 * **NOTE**: If a non-Store value is passed as `store`, then it will be wrapped in a `Writable` Store
 *
 * **NOTE**: By default, `immutable` can **ONLY** shallow clone `Object`s and `Array`s. If deep or specific cloning is needed, pass a `clone` function
 *
 * For a simple example, in making a `Readable` Store immutable:
 *
 * ```javascript
 * import {readable} from "svelte/store";
 * import {immutable} from "svelte-commons/lib/stores/shared";
 *
 * const initial_value = {key: "value"};
 *
 * const readable_store = readable(initial_value);
 *
 * const store = immutable(readable_store);
 *
 * store.subscribe((value) => {
 *     console.log({initial_value, value});
 *     console.log(value === initial_value);
 * }); // logs: `false`
 * ```
 *
 * Another simple example, but this time making a `Writable` Store immutable:
 *
 * ```javascript
 * import {derived, writable} from "svelte/store";
 * import {immutable} from "svelte-commons/lib/stores/shared";
 *
 * const initial_value = {key: "value"};
 *
 * const writable_store = writable(initial_value);
 *
 * const store = immutable(writable_store);
 *
 * // NOTE: A `derived` Store is used here for simpler looking code
 * const derived_store = derived([writable_store, store], ([$writable, $store]) => {
 *     console.log({$writable, $store});
 *     console.log($writable === $store);
 * });
 *
 * // NOTE: This subscription is just so the `derived` callback starts running
 * derived_store.subscribe(() => {}); // logs: `false`
 *
 * store.set({key: "not a value!"}); // logs: `false`
 * ```
 *
 * @param store
 * @param clone
 * @param start
 */
export function immutable<T>(
    store: T | Readable<T> | Writable<T>,
    clone: ICloner<T> = clone_value,
    start?: IStoreStartStopNotifier<T>
): Readable<T> | Writable<T> {
    // Need to support raw non-Store values being passed, so
    // we wrap them in a `Writable` Store
    if (!is_readable(store)) store = writable(store, start);

    if (is_writable(store)) return overlay(store, clone, clone);
    return derived(store, clone);
}
