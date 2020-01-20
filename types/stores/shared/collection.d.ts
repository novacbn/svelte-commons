import { Writable } from "svelte/store";
import { IMapper, IPredicate, IUpdater } from "../../util/shared/functional";
import { IStartStopNotifier } from "../store";
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
export declare function collection<T extends object>(store?: Writable<T[]> | T[], start?: IStartStopNotifier<T[]>): ICollectionStore<T>;
