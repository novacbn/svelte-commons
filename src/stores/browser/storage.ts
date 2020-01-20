import {Readable, Writable, readable, writable} from "svelte/store";

import {CONTEXT_IS_BROWSER} from "../../util/shared/context";

/**
 * Represents values that `storage` can serialize
 */
export type IJSONType = boolean | number | string | IJSONType[] | {[key: string]: IJSONType};

/**
 * Represents the Svelte Store factory returned by `storage`
 */
export type IStorageStore<T> = (key: string, default_value: T) => Readable<T> | Writable<T>;

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
 * Returns the standardized defaults for options passed into `storage` Store
 *
 * @internal
 *
 * @param options
 */
function StorageOptions(options: IStorageOptions = {}): IStorageOptions {
    return {
        event: undefined,
        event_source: undefined,
        prefix: "svelte-commons.",
        ...options
    };
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
export function storage<T extends IJSONType>(
    adapter: Storage,
    options: IStorageOptions = {}
): IStorageStore<T> {
    const {event, event_source, prefix} = StorageOptions(options);

    return (key, default_value) => {
        if (!CONTEXT_IS_BROWSER) return readable<T>(default_value, () => {});

        if (prefix) key = prefix + key;

        const stored_value = adapter.getItem(key);
        const parsed_value = stored_value ? JSON.parse(stored_value) : default_value;

        const store = writable<T>(parsed_value, (set) => {
            function on_change(event: any) {
                event: StorageEvent = event.detail ? event.detail : event;

                if (event.storageArea !== adapter || event.key !== key) return;

                if (event.newValue) set(JSON.parse(event.newValue));
                else set(default_value);
            }

            if (event) {
                event_source?.addEventListener(event, on_change as any);
                return () => event_source?.removeEventListener(event, on_change as any);
            }
        });

        store.subscribe((value) => {
            if (value === default_value || typeof value === "undefined") adapter.removeItem(key);
            else adapter.setItem(key, JSON.stringify(value));
        });

        return store;
    };
}

/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.localStorage`
 *
 * ```javascript
 * TODO:
 * ```
 */
export const local_storage = storage(localStorage, {
    event: "storage",
    event_source: window
});

/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.sessionStorage`
 *
 * ```javascript
 * TODO:
 * ```
 */
export const session_storage = storage(sessionStorage, {
    event: "storage",
    event_source: window
});
