import {Readable, Writable, readable, writable} from "svelte/store";

import {get_url, update_url} from "../../util/browser/location";

import {overlay} from "../shared/overlay";

/**
 * Represents a Svelte Store factory, for making [`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location)-based `Writable` Stores
 */
export type ILocationStore = (
    options: Partial<ILocationOptions>
) => Readable<string> | Writable<string>;

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
 * Returns the options passable into the [[hash]], [[pathname]], or [[search]] Svelte Stores, with standard defaults
 *
 * @internal
 *
 * @param options
 */
function LocationOptions(options: Partial<ILocationOptions> = {}): ILocationOptions {
    const {hash = false, readonly = false, replace = false} = options;

    return {hash, readonly, replace};
}

/**
 * Returns a factory function, for binding a [`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location) component into a `Writable` Svelte Store
 *
 * @internal
 *
 * @param component
 */
function make_location_store(component: string): ILocationStore {
    return (options) => {
        const {hash, readonly, replace} = LocationOptions(options);

        function get_value(): string {
            const url = get_url(hash);

            return (url as any)[component];
        }

        function on_start(set: (value: string) => void) {
            function on_popstate(event: PopStateEvent) {
                set(get_value());
            }

            set(get_value());
            window.addEventListener("popstate", on_popstate);
            return () => {
                window.removeEventListener("popstate", on_popstate);
            };
        }

        if (readonly) return readable(get_value(), on_start);

        function set_value(value: string): void {
            const url = get_url(hash);

            (url as any)[component] = value;

            update_url(url, hash, replace);
        }

        const store = writable(get_value(), on_start);

        return overlay(
            store,
            (value) => value,
            (value) => {
                set_value(value);

                return value;
            }
        );
    };
}

/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.hash`](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) component
 *
 * @param options
 */
export const hash = make_location_store("hash");

/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) component
 *
 * @param options
 */
export const pathname = make_location_store("pathname");

/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.search`](https://developer.mozilla.org/en-US/docs/Web/API/Location/search) component
 *
 * @param options
 */
export const search = make_location_store("search");
