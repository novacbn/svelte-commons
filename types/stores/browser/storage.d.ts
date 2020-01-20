import { Readable, Writable } from "svelte/store";
/**
 * Represents values that `storage` can serialize
 */
export declare type IJSONType = boolean | number | string | IJSONType[] | {
    [key: string]: IJSONType;
};
/**
 * Represents the Svelte Store factory returned by `storage`
 */
export declare type IStorageStore<T> = (key: string, default_value: T) => Readable<T> | Writable<T>;
/**
 * Represents all the options passable into `storage`
 */
export interface IStorageOptions {
    /**
     * Represents the event to listen to for changes
     */
    event?: string;
    /**
     * Represents the source of the event to listen to
     */
    event_source?: EventTarget;
    /**
     * Represents the prefix to prepend to all bound keys
     */
    prefix?: string;
}
/**
 * Returns a `Readable` (Server) / `Writable` (Browser) Svelte Store with a reactive binding to a given `Storage` adapter
 *
 * ```javascript
 * TODO:
 * ```
 *
 * @param adapter
 * @param options
 */
export declare function storage<T extends IJSONType>(adapter: Storage, options?: IStorageOptions): IStorageStore<T>;
/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.localStorage`
 *
 * ```javascript
 * TODO:
 * ```
 */
export declare const local_storage: IStorageStore<IJSONType>;
/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.sessionStorage`
 *
 * ```javascript
 * TODO:
 * ```
 */
export declare const session_storage: IStorageStore<IJSONType>;
