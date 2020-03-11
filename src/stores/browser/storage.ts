import {Readable, Writable, readable, writable} from "svelte/store";

import {IJSONType} from "../../util/shared/builtin";
import {CONTEXT_IS_BROWSER} from "../../util/shared/context";

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
 * NOTE: Only **JSON-compatible** values are supported
 *
 * As a semi-complete example:
 *
 * ```javascript
 * import {get} from "svelte/store";
 *
 * import {storage} from "svelte-commons/lib/stores/browser";
 *
 * // Below, creating a factory function wrapper around the `localStorage` Web Storage API
 * const local_storage = storage(window.localStorage, {
 *     // Both `event` and `event_source` tells the Store what event string to
 *     // listen to and what `EventTarget` to listen from for tab-sync
 *     event: "storage",
 *     event_source: window,
 *
 *     // `.prefix` tells the Store to prefix all storage keys with a specific string (defaults to `svelte-commons.`)
 *     prefix: "my_key_prefix."
 * });
 *
 * // Now we can use our new `local_storage` factory to make a reactive Store binding
 * // to a specific `localStorage` key.
 * const store = local_storage("my_string_key", "I am default");
 *
 * // Using `get`, we can see the Store is already at its default
 * console.log(get(store)); // logs: `I am default`
 *
 * // Since there is nothing set yet, the actual localStorage key is empty
 * console.log(window.localStorage.getItem("my_key_prefix.my_string_key")) // logs: `null`
 *
 * // After setting a value, both the Store and `localStorage` have the same value
 * store.set("But, this is not default");
 * console.log(
 *     get(store),
 *     window.localStorage.getItem("my_key_prefix.my_string_key")
 * ); // logs: `But, this is not default`, `"But, this is not default"`
 *
 * // By setting the Store to the default value OR `undefined`, the
 * // `localStorage` item is removed
 * store.set("I am default");
 *
 * console.log(
 *     get(store),
 *     window.localStorage.getItem("my_key_prefix.my_string_key")
 * ); // logs: `I am default`, `null`
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
 * NOTE: Only **JSON-compatible** values are supported
 *
 * As a minimal example:
 *
 * ```javascript
 * import {local_storage} from "svelte-commons/lib/stores/browser";
 *
 * const store = local_storage("my_string_key", "some default string");
 *
 * store.subscribe((value) => {
 *     console.log(value);
 * }); // Will log any changes to the Store
 *
 * store.set("a non-default string"); // logs: `a non-default string`
 *
 * console.log(
 *     window.localStorage.getItem("svelte-commons.my_string_key")
 * ); // logs: `"a non-default string"`
 * ```
 */
export const local_storage = storage(localStorage, {
    event: "storage",
    event_source: window
});

/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.sessionStorage`
 *
 * NOTE: Only **JSON-compatible** values are supported
 *
 * As a minimal example:
 *
 * ```javascript
 * import {session_storage} from "svelte-commons/lib/stores/browser";
 *
 * const store = session_storage("my_string_key", "some default string");
 *
 * store.subscribe((value) => {
 *     console.log(value);
 * }); // Will log any changes to the Store
 *
 * store.set("a non-default string"); // logs: `a non-default string`
 *
 * console.log(
 *     window.sessionStorage.getItem("svelte-commons.my_string_key")
 * ); // logs: `"a non-default string"`
 * ```
 */
export const session_storage = storage(sessionStorage, {
    event: "storage",
    event_source: window
});
