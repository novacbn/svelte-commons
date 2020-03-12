import { Writable } from "svelte/store";
/**
 * Represents a function for overlay I/O
 */
export declare type IOverlay<T> = (value: T) => T;
/**
 * Returns a new `Writable` Svelte Store that has it's I/O overlaid with the `read` function for `.subscribe` / `.update` and `.write` function for `.set` / `.update`
 *
 * ```javascript
 * import {writable} from "svelte/store";
 *
 * import {overlay} from "svelte-commons/lib/stores/shared/overlay";
 *
 * // For the base Store, it's going to maintain the JSON-encoded view of data
 * // passed in. So we need to default it to an empty string
 * const raw_store = writable("");
 *
 * // Here, we're creating a `Writable` "overlay" Store, which will encode all
 * // inputs to JSON before writing to the base Store. And then parse all values
 * // from the base Store as JSON, for subscriptions and updater functions
 * const store = overlay(
 *     raw_store,
 *     (value) => JSON.parse(value),
 *     (value) => JSON.stringify(value)
 * );
 *
 * raw_store.subscribe(console.log); // logs: ``
 *
 * // As you can see when `.set` is ran, our base Store's logger
 * // shows the JSON-encoded data
 * store.set({hello: "world"}); // logs: `{"hello":"world"}`
 * ```
 *
 * @param store
 * @param read
 * @param write
 */
export declare function overlay<T>(store: Writable<T>, read: IOverlay<T>, write: IOverlay<T>): Writable<T>;
