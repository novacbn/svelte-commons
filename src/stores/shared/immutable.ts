import {Readable, readable, Writable, writable} from "svelte/store";

import {
    IStoreInvalidator,
    IStoreStartStopNotifier,
    IStoreSubscriber,
    IStoreUpdater,
    is_readable,
    is_writable
} from "../../util/shared/stores";

/**
 * Returns a `Readable` Svelte Store, in which all input / output from the
 * Store are unique deep clones via the given `clone` function
 *
 * ```javascript
 * import {immutable_readable} from "svelte-commons/lib/stores/shared";
 *
 * // With the below `clone` code, we are providing a fast
 * // customized deep cloning function for our data structure
 * //
 * // Which will be ran by the Store for every commit / retrieval
 * function clone(array) {
 *     return array.map((value) => {
 *         return {
 *             name: value.name,
 *             positions: [...value.positions]
 *         };
 *     });
 * }
 *
 * const initial_data = [
 *     {
 *         name: "John Smith",
 *         positions: ["President", "Ex-CIA Agent"]
 *     },
 *
 *     {
 *         name: "James Bond",
 *         positions: ["MI6 Agent", "Rival of John Smith"]
 *     }
 * ];
 *
 * // Here, we're passing our inital data structure and cloning function.
 * // Internally, the `initial_data` value will be cloned on Store creation as-well
 *
 * const store = immutable_readable(initial_data, (set) => {
 *     return () => {};
 * });
 *
 * let cache;
 *
 * store.subscribe((value) => {
 *     cache = value;
 * }); // caches cloned value of `initial_data`
 *
 * console.log(initial_data === cache); // logs `false`, since `cache` is a unique clone
 * ```
 *
 * @param value
 * @param clone
 * @param start
 */
export function immutable_readable<T>(
    value: T | Readable<T>,
    clone: IStoreUpdater<T>,
    start: IStoreStartStopNotifier<T>
): Readable<T> {
    let store: Readable<T>;

    // We need to support both creation of a `Readable` Store,
    // and wrapping of an existing `Readable` Store
    if (is_readable(value)) {
        store = value as Readable<T>;
    } else {
        const _start = (set: IStoreSubscriber<T>) => {
            function _set(value: T) {
                value = clone(value);

                set(value);
            }

            return start(_set);
        };

        value = clone(value as T);
        store = readable(value, _start);
    }

    const {subscribe} = store;

    const _subscribe = (run: IStoreSubscriber<T>, invalidate: IStoreInvalidator<T> | undefined) => {
        const _run = (value: T) => {
            value = clone(value);

            run(value);
        };

        return subscribe(_run, invalidate);
    };

    return {subscribe: _subscribe};
}

/**
 * Returns a `Writable` Svelte Store, in which all input / output from the
 * Store are unique deep clones via the given `clone` function
 *
 * ```javascript
 * import {immutable_writable} from "svelte-commons/lib/stores/shared";
 *
 * // With the below `clone` code, we are providing a fast
 * // customized deep cloning function for our data structure
 * //
 * // Which will be ran by the Store for every commit / retrieval
 * function clone(array) {
 *     return array.map((value) => {
 *         return {
 *             name: value.name,
 *             positions: [...value.positions]
 *         };
 *     });
 * }
 *
 * const initial_data = [
 *     {
 *         name: "John Smith",
 *         positions: ["President", "Ex-CIA Agent"]
 *     },
 *
 *     {
 *         name: "James Bond",
 *         positions: ["MI6 Agent", "Rival of John Smith"]
 *     }
 * ];
 *
 * // Here, we're passing our inital data structure and cloning function.
 * // Internally, the `initial_data` value will be cloned on Store creation as-well
 * const store = immutable_writable(initial_data, clone);
 *
 * let value_one, value_two;
 *
 * store.subscribe((value) => {
 *     value_one = value;
 * }); // caches cloned value of `initial_data`
 *
 * store.subscribe((value) => {
 *     value_two = value;
 * }); // caches cloned value of `initial_data`
 *
 * console.log(value_one === value_two); // logs `false`, since `value_one` / `value_two` are both unique clones
 *
 * // Demonstrating below, that even `Writable.set` clones before commit
 * const value_three = value_one;
 *
 * value_three.push({
 *     name: "Goldfinger",
 *     positions: ["Ex-Gold Smuggler"]
 * });
 *
 * store.set(value_three);
 *
 * console.log(value_one === value_three); // logs `false`, since `value_one` is now a new unique clone
 * ```
 *
 * @param value
 * @param clone
 * @param start
 */
export function immutable_writable<T>(
    value: T | Writable<T>,
    clone: IStoreUpdater<T>,
    start?: IStoreStartStopNotifier<T>
): Writable<T> {
    let store: Writable<T>;

    if (is_writable(value)) {
        store = value as Writable<T>;
    } else {
        let _start: IStoreStartStopNotifier<T> | undefined;
        if (start) {
            _start = () => {
                const _set = (value: T) => {
                    value = clone(value);

                    set(value);
                };

                return start(_set);
            };
        }

        value = clone(value as T);
        store = writable(value, _start);
    }

    const {set, subscribe, update} = store;

    const _set = (value: T) => {
        value = clone(value);

        set(value);
    };

    const _subscribe = (run: IStoreSubscriber<T>, invalidate: IStoreInvalidator<T> | undefined) => {
        const _run = (value: T) => {
            value = clone(value);

            run(value);
        };

        return subscribe(_run, invalidate);
    };

    const _update = (updater: IStoreUpdater<T>) => {
        const _updater = (value: T) => {
            value = clone(value);

            return clone(updater(value));
        };

        return update(_updater);
    };

    return {
        set: _set,
        subscribe: _subscribe,
        update: _update
    };
}
