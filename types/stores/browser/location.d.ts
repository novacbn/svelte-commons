import { Readable, Writable } from "svelte/store";
/**
 * Represents a Svelte Store factory, for making [`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location)-based `Writable` Stores
 */
export declare type ILocationStore = (options: Partial<ILocationOptions>) => Readable<string> | Writable<string>;
/**
 * Represents the options passable into the [[hash]], [[pathname]], and [[search]] Svelte Stores
 */
export interface ILocationOptions {
    /**
     * Represents if the URL hash should be used as the href source, e.g. `https://my.domain/x/y/z` or `https://my.domain/#x/y/z`
     */
    hash: boolean;
    /**
     * Represents if the Store returned is a `Readable` Store, rather than a `Writable`
     */
    readonly: boolean;
    /**
     * Represents if updates to the Store should creating a new [History](https://developer.mozilla.org/en-US/docs/Web/API/History_API) entry or not, e.g. back button-able
     */
    replace: boolean;
}
/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.hash`](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) component
 *
 * @param options
 */
export declare const hash: ILocationStore;
/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) component
 *
 * @param options
 */
export declare const pathname: ILocationStore;
/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.search`](https://developer.mozilla.org/en-US/docs/Web/API/Location/search) component
 *
 * @param options
 */
export declare const search: ILocationStore;
