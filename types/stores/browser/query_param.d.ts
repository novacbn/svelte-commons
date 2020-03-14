import { Writable } from "svelte/store";
/**
 * Represents the options passable into the [[query_param]] Svelte Store
 */
export interface IQueryParamOptions {
    /**
     * Represents if the URL hash should be used as the href source, e.g. `https://my.domain/?x=y` or `https://my.domain/#?x=y`
     */
    hash: boolean;
    /**
     * Represents if updates to the Store should creating a new [History](https://developer.mozilla.org/en-US/docs/Web/API/History_API) entry or not, e.g. back button-able
     */
    replace: boolean;
}
/**
 *
 * @param key
 * @param default_value
 * @param options
 */
export declare function query_param<T = boolean | string>(key: string, default_value: boolean | string, options?: Partial<IQueryParamOptions>): Writable<T>;
