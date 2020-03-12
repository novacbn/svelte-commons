import { Writable } from "svelte/store";
/**
 * Represents a function for overlay I/O
 */
export declare type IOverlay<T> = (value: T) => T;
/**
 * Returns a new `Writable` Svelte Store that has it's I/O overlaid with the `read` function for `.subscribe` / `.update` and `.write` function for `.set` / `.update`
 * @param store
 * @param read
 * @param write
 */
export declare function overlay<T>(store: Writable<T>, read: IOverlay<T>, write: IOverlay<T>): Writable<T>;
