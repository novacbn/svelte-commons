/**
 * Represents the lookup map returned by `make_array_lookup` / `make_object_lookup`
 */
export declare type ILookupMap = {
    [key: string]: boolean;
};
/**
 * Represents the predicate filter, function, or `Array` index used in `filter_collection` / `find_collection` / `reject_collection`
 */
export declare type IPredicate<T> = ((value: T, index: number) => boolean) | Partial<T> | number;
/**
 * Represents the mapping value or function used in `map_collection`
 */
export declare type IMapper<T> = ((value: T, index: number) => Partial<T>) | Partial<T>;
/**
 * Represents the updating value or function used in `update_value`
 */
export declare type IUpdater<T> = ((value: T) => Partial<T>) | T;
/**
 * Returns the number of non-identity `!==` hits between the key-values of each object
 * @param object_a
 * @param object_b
 */
export declare function diff_count(object_a: {
    [key: string]: any;
}, object_b: {
    [key: string]: any;
}): number;
/**
 * Returns the filtered `array` element, that naively matches the `predicate`
 * @param array
 * @param predicate
 */
export declare function filter_collection<T extends object>(array: T[], predicate?: IPredicate<T> | null): T[];
/**
 * Returns the first `array` element that, naively matches the `predicate`
 * @param array
 * @param predicate
 */
export declare function find_collection<T extends object>(array: T[], predicate?: IPredicate<T> | null): T | undefined;
/**
 * Returns true if the passed in `value` is `false`, `undefined`, or `null`
 * @param value
 */
export declare function is_falsy(value: any): boolean;
/**
 * Returns the a new Array of elements from `array`, with using `mapper` to remap each element
 * @param {*} array
 * @param {*} mapper
 */
export declare function map_collection<T extends object>(array: T[], mapper: IMapper<T>): T[];
/**
 * Returns true if the key-values in `predicate` match that of `item`
 * @param item
 * @param predicate
 */
export declare function match_predicate<T extends object>(item: T, predicate: Partial<T>): boolean;
/**
 * Returns the filtered `array` element, that naively DOES NOT match the `predicate`
 * @param array
 * @param predicate
 */
export declare function reject_collection<T extends object>(array: T[], predicate?: IPredicate<T> | null): T[];
/**
 * Returns the updated `item`, with using `updater` to remap the any values
 * @param {*} item
 * @param {*} updater
 */
export declare function update_object<T extends object>(item: T, updater: IUpdater<T>): [number, T];
