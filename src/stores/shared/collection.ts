import {Writable, get, writable} from "svelte/store";

import {
    IMapper,
    IPredicate,
    IUpdater,
    filter_collection,
    find_collection,
    map_collection,
    reject_collection,
    update_object
} from "../../util/shared/functional";

import {IStartStopNotifier} from "../store";

/**
 * Represents a `Writable` Svelte Store for interacting with an `Array` of `Object`s
 *
 * NOTE: All operation methods use `get` from `svelte/store`, which may incur
 * performance penalty in hot codepaths
 *
 * As a minimal example:
 *
 * ```javascript
 * import {collection} from "svelte-commons/lib/stores/shared";
 *
 * // We can pass nothing, which will just initialize an internal empty `Array`
 * const store = collection();
 *
 * // Or, we can also pass in our own `Array` value
 * const store = collection([
 *     {
 *         name: "John Smith",
 *         positions: ["President", "Ex-CIA Agent"]
 *     },
 *
 *     {
 *         name: "James Bond",
 *         positions: ["MI6 Agent", "Rival of John Smith"]
 *     }
 * ]);
 * ```
 *
 * Alternatively, you can wrap any Store that implements `.subscribe`, and optionally `.set` for mutations
 *
 * ```javascript
 * import {local_storage} from "svelte-commons/lib/stores/browser";
 * import {collection} from "svelte-commons/lib/stores/shared";
 *
 * // We're binding `localStore.getItem/setItem("my_array_key", ...)` into a Svelte Store
 * const storage = local_storage("my_array_key", []);
 *
 * // And then wrapping it into the `collection` Store to treat it a reactive
 * // source of an `Array` of `Object`s
 * const store = collection(store);
 * ```
 */
export interface ICollectionStore<T> extends Writable<T[]> {
    /**
     * Returns a filtered copy current collection, with every item that matches the `predicate`
     *
     * As a minimal example:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // Define our initial collection payload
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
     * const store = collection(initial_data);
     *
     * // We filter for objects that only have `John Smith` as the `.name` key
     * const results = store.filter({name: "John Smith"});
     *
     * console.log({results}); // logs: `[{name: "John Smith", positions: ["President", "Ex-CIA Agent"]}]`
     *
     * // Then we put our results back into the Store
     * store.set(results);
     *
     * // Alternatively, we can also pass in the index of what we want:
     * // const results = store.filter(0);
     *
     * // Or, a function that filters the items manually:
     * // const results = store.filter((value, index) => value.name === "John Smith");
     * ```
     *
     * For simplicity, you can also have [[ICollectionStore.filter]] set the Store value for you:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * const store = collection(...);
     *
     * // When passing `true`, `store.set` is called for us. And the
     * // results is still returned
     * const results = store.filter({name: "John Smith"}, true);
     * ```
     */
    filter(predicate?: IPredicate<T> | null, mutate?: boolean): T[];

    /**
     * Returns the first collection item that matches the `predicate`
     *
     * As a minimal example:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // Define our initial collection payload
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
     * const store = collection(initial_data);
     *
     * // Find only the first object that has `John Smith` as the `.name` key
     * const results = store.find({name: "John Smith"});
     *
     * console.log({results}); // logs: `{name: "John Smith", positions: ["President", "Ex-CIA Agent"]}`
     *
     * // Alternatively, we can also pass in the index of what we want:
     * // const results = store.find(0);
     *
     * // Or, a function that filters the items manually:
     * // const results = store.find((value, index) => value.name === "John Smith");
     * ```
     */
    find(predicate?: IPredicate<T> | null): T | undefined;

    /**
     * Returns the current collection of items from the internal Store
     *
     * NOTE: This is just a wrapper around `get` from `svelte/store`
     *
     * As a minimal example:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * const store = collection(...);
     * const array = store.get();
     *
     * console.log(array);
     * ```
     */
    get(): T[];

    /**
     * Returns the current collection of items, with each item remapped with new values
     *
     * As a minimal example:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // Define our initial collection payload
     * const initial_data = [
     *     {
     *         name: "James Bond",
     *         positions: ["MI6 Agent"]
     *     }
     * ];
     *
     * const store = collection(initial_data);
     *
     * // Here, we're passing in a `mapper` that returns new objects that
     * // containing the previous `.positions` values but replace all the
     * // `.name` values with a specific string
     * store.map((value, index) => {
     *     const new_value = {
     *         name: "Agent 006",
     *         positions: value.positions
     *     };
     * });
     * ```
     *
     * You can also partially update every collection item as-well:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * const initial_data = [
     *     {
     *         name: "James Bond",
     *         positions: ["MI6 Agent"]
     *     }
     * ];
     *
     * const store = collection(initial_data);
     *
     * // Instead of passing a function to `mapper`, we're passing a partial
     * // object that will be applied to every collection item instead
     * store.map({name: "Agent 006"});
     * ```
     */
    map(mapper: IMapper<T>, mutate?: boolean): T[];

    /**
     * Pushes the item into the collection, returning the new index
     *
     * As a minimal example:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // If we don't pass a value, it'll just initialize with an empty array
     * const store = collection();
     *
     * // `ICollectionStore.push` works similar to `Array.push`, returning the new length
     * // of the internal array each push
     * const index_one = store.push({
     *     name: "John Smith",
     *     positions: ["President", "Ex-CIA Agent"]
     * });
     *
     * const index_two = store.push({
     *     name: "James Bond",
     *     positions: ["MI6 Agent", "Rival of John Smith"]
     * });
     *
     * console.log(index_one, index_two); // logs `0, 1`
     * ```
     */
    push(item: T): number;

    /**
     * Returns a filtered copy current collection, with every item that DOES NOT match the `predicate`
     *
     * As a minimal example:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // Define our initial collection payload
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
     * const store = collection(initial_data);
     *
     * // We reject any object that don't have `James Bond` as their `.name` key
     * const results = store.reject({name: "James Bond"});
     *
     * console.log({results}); // logs: `[{name: "John Smith", positions: ["President", "Ex-CIA Agent"]}]`
     *
     * // Then we put our results back into the Store
     * store.set(results);
     *
     * // Alternatively, we can also pass in the index of what we want:
     * // const results = store.reject(1);
     *
     * // Or, a function that filters the items manually:
     * // const results = store.reject((value, index) => value.name === "James Bond");
     * ```
     *
     * For simplicity, you can also have [[ICollectionStore.reject]] set the Store value for you:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * const store = collection(...);
     *
     * // When passing `true`, `store.set` is called for us. And the
     * // results is still returned
     * const results = store.reject({name: "James Bond"}, true);
     * ```
     */
    reject(predicate?: IPredicate<T> | null, mutate?: boolean): T[];

    /**
     * Removes the collection item at the given `index` position, and returns a copy of it
     *
     * NOTE: This function throws an exception, if no item was found matching `index`
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // Define our initial collection payload
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
     * const store = collection(initial_data);
     *
     * // When removing the second collection item (1-index), we
     * // get the object back as the return value
     * const results = store.remove(1);
     *
     * console.log(results); // logs: `{name: "James Bond", positions: ["MI6 Agent", "Rival of John Smith"]}`
     * ```
     */
    remove(index: number): T;

    /**
     * Updates the item that matches the given `predicate` with the `updater`
     *
     * NOTE: This function errors if no item was found matching `predicate`
     *
     * As a minimal example:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // Define our initial collection payload
     * const initial_data = [
     *     {
     *         name: "John Smith",
     *         positions: ["President", "Ex-CIA Agent"]
     *     }
     * ];
     *
     * const store = collection(initial_data);
     *
     * // Here, we're caching the very first collection item
     * const first_find = store.find(0);
     *
     * // Next, we're overwriting the item at that index
     * store.set_item(0, {
     *     name: "James Bond",
     *     positions: ["MI6 Agent", "Rival of John Smith"]
     * });
     *
     * // Then, caching our new collection item
     * const second_find = store.find(0);
     *
     * // Since we overwrote the first collection item, our two
     * // results will not equal each other
     * console.log(first_find === second_find); // logs: `false`
     *
     * // Alternatively, we can pass a filter object to `predicate` instead of an index:
     * // const first_find = store.set_item({name: "John Smith"}, ...);
     *
     * // Or even pass a filter function too:
     * // const first_find = store.set_item((value, index) => value.name === "John Smith", ...);
     * ```
     *
     * Every `updater` you pass, actually partially updates the existing collection item:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // Define our initial collection payload
     * const initial_data = [
     *     {
     *         name: "James Bond",
     *         positions: ["MI6 Agent"]
     *     }
     * ];
     *
     * const store = collection(initial_data);
     *
     * const first_find = store.find(0);
     *
     * // Here we're applying a partial update to just change the `.name` key
     * store.set_item(0, {name: "Agent 006"});
     *
     * const second_find = store.find(0);
     *
     * // Since we did a partial update, both cached collection items have similar values
     *
     * console.log(first_find); // logs: `{name: "James Bond", positions: ["MI6 Agent"]}`
     *
     * console.log(second_find); // logs: `{name: "Agent 006", positions: ["MI6 Agent"]}`
     *
     * // And since it was a partial update, the `.positions` key on each
     * // item is actually the exact same array reference
     * console.log(first_find.positions === second_find.positions) // logs: `true`
     * ```
     *
     * And finally, we can pass a function to `updater` instead:
     *
     * ```javascript
     * import {collection} from "svelte-commons/lib/stores/shared";
     *
     * // Define our initial collection payload
     * const initial_data = [
     *     {
     *         name: "James Bond",
     *         positions: ["MI6 Agent"]
     *     }
     * ];
     *
     * const store = collection(initial_data);
     *
     * // Here, we're passing in an `updater` that returns a new object
     * // containing the previous `.positions` value and a new `.name` value
     * store.set_item(0, (value) => {
     *     const new_value {
     *         names: "Agent 006",
     *         positions: value.positions
     *     };
     *
     *     return new_value;
     * });
     * ```
     */
    set_item(predicate: IPredicate<T>, updater: IUpdater<T>): T;
}

/**
 * Returns a `Writable` Svelte Store that implements [[ICollectionStore]] for interacting with an `Array` of `Object`s
 * @param store
 * @param start
 */
export function collection<T extends object>(
    store: Writable<T[]> | T[] = [],
    start?: IStartStopNotifier<T[]>
): ICollectionStore<T> {
    // Need to support end-developers passing in both initial arrays and stores
    if (Array.isArray(store)) store = writable(store, start);

    const {update, set, subscribe} = store;

    const filter = (predicate?: IPredicate<T> | null, mutate: boolean = false) => {
        let array = get(store);
        array = filter_collection<T>(array, predicate);

        if (mutate) set(array);
        return array;
    };

    const find = (predicate?: IPredicate<T> | null) => {
        const array = get(store);
        const item = find_collection(array, predicate);

        return item;
    };

    const _get = () => get(store);

    const map = (mapper: IMapper<T>, mutate: boolean = false) => {
        let array = get(store);
        array = map_collection<T>(array, mapper);

        if (mutate) set(array);
        return array;
    };

    const push = (item: T) => {
        const array = get(store);
        const index = array.push(item);

        set(array);
        return index;
    };

    const reject = (predicate?: IPredicate<T> | null, mutate: boolean = false) => {
        let array = get(store);
        array = reject_collection<T>(array, predicate);

        if (mutate) set(array);
        return array;
    };

    const remove = (index: number): T => {
        const array = get(store);
        if (typeof array[index] === "undefined") {
            throw new ReferenceError(
                `bad dispatch to 'collection.remove_item' (no item at index '${index}')`
            );
        }

        const [item] = array.splice(index, 1);
        set(array);

        return {...item};
    };

    const set_item = (predicate: IPredicate<T>, updater: IUpdater<T>) => {
        const array = get(store);
        const item = find_collection(array, predicate);

        if (!item) {
            throw new ReferenceError(
                "bad dispatch to 'collection.set_item' (no items match predicate)"
            );
        }

        // If there were no updates performed on the target
        // item, then we can skip and return the copy
        const [updates, _item] = update_object(item, updater);
        if (updates < 1) return _item;

        let index = 0;
        for (const _index in array) {
            if (array[_index] === item) {
                index = parseInt(_index);
                break;
            }
        }

        array[index] = _item;
        set(array);

        return {..._item};
    };

    return {
        update,
        set,
        subscribe,

        filter,
        find,
        map,
        push,
        reject,
        remove,
        set_item,
        get: _get
    };
}
