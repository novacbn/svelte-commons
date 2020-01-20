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
 * ```javascript
 * TODO:
 * ```
 */
export interface ICollectionStore<T> extends Writable<T[]> {
    /**
     * Returns a filtered copy current collection, with every item that matches the `predicate`
     *
     * NOTE: If `mutate` is `true`, the Store is automatically set with the new result
     *
     * ```javascript
     * TODO:
     * ```
     */
    filter: (predicate?: IPredicate<T> | null, mutate?: boolean) => T[];

    /**
     * Returns the first collection item that matches the `predicate`
     *
     * ```javascript
     * TODO:
     * ```
     */
    find: (predicate?: IPredicate<T> | null) => T | undefined;

    /**
     * Returns the current collection of items from the internal Store
     *
     * NOTE: This is just a wrapper around `get` from `svelte/store`
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
    get: () => T[];

    /**
     * Returns the current collection of items, with each item remapped with new values
     *
     * NOTE: If `mutate` is `true`, the Store is automatically set with the new result
     *
     * ```javascript
     * TODO:
     * ```
     */
    map: (mapper: IMapper<T>, mutate?: boolean) => T[];

    /**
     * Pushes the item into the collection, returning the new index
     *
     * ```javascript
     * TODO:
     * ```
     */
    push: (item: T) => number;

    /**
     * Returns a filtered copy current collection, with every item that DOES NOT match the `predicate`
     *
     * NOTE: If `mutate` is `true`, the Store is automatically set with the new result
     *
     * ```javascript
     * TODO:
     * ```
     */
    reject: (predicate?: IPredicate<T> | null, mutate?: boolean) => T[];

    /**
     * Removes the collection item at the given `index` position, and returns a copy of it
     *
     * NOTE: This function errors if no item was found matching `index`
     *
     * ```javascript
     * TODO:
     * ```
     */
    remove: (index: number) => T;

    /**
     * Updates the item that matches the given `predicate` with the `updater`
     *
     * NOTE: This function errors if no item was found matching `predicate`
     *
     * ```javascript
     * TODO:
     * ```
     */
    set_item: (predicate: IPredicate<T>, updater: IUpdater<T>) => T;
}

/**
 * Returns a `Writable` Svelte Store for interacting with an `Array` of `Object`s
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
