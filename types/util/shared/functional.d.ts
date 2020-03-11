/**
 * Represents the predicate filter, function, or `Array` index used in `filter_collection` / `find_collection` / `reject_collection`
 */
export declare type IPredicatePartial<T> = ((value: T, index: number) => boolean) | Partial<T> | number;
/**
 * Represents the mapping value or function used in `map_collection`
 */
export declare type IMapperPartial<T> = ((value: T, index: number) => Partial<T>) | Partial<T>;
/**
 * Represents the updating value or function used in `update_value`
 */
export declare type IUpdatePartial<T> = ((value: T) => Partial<T>) | Partial<T>;
/**
 * Represents a entry from an object that was processed via `Object.entries`
 */
export declare type IObjectEntry<T> = [string, T];
/**
 * Represents a sorting comparator for sorting between the keys in a `Object.entries` Array output
 *
 * @internal
 *
 * @param entry_a
 * @param entry_b
 */
export declare function comparator_entries([key_a]: IObjectEntry<any>, [key_b]: IObjectEntry<any>): number;
/**
 * Returns the number of non-identity `!==` hits between the key-values of each object
 *
 * @internal
 *
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
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
export declare function filter_collection<T extends object>(array: T[], predicate?: IPredicatePartial<T> | null): T[];
/**
 * Returns the first `array` element that, naively matches the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
export declare function find_collection<T extends object>(array: T[], predicate?: IPredicatePartial<T> | null): T | undefined;
/**
 * Returns true if the passed in `value` is `undefined`, `null`, `""`, or `false`
 *
 * @internal
 *
 * @param value
 */
export declare function is_falsy(value: any): boolean;
/**
 * Returns the a new Array of elements from `array`, with using `mapper` to remap each element
 *
 * @internal
 *
 * @param {*} array
 * @param {*} mapper
 */
export declare function map_collection<T extends object>(array: T[], mapper: IMapperPartial<T>): T[];
/**
 * Returns true if the key-values in `predicate` match that of `item`
 *
 * @internal
 *
 * @param item
 * @param predicate
 */
export declare function match_predicate<T extends object>(item: T, predicate: Partial<T>): boolean;
/**
 * Returns the filtered `array` element, that naively DOES NOT match the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
export declare function reject_collection<T extends object>(array: T[], predicate?: IPredicatePartial<T> | null): T[];
/**
 * Returns the updated `item`, with using `updater` to remap the any values
 *
 * @internal
 *
 * @param {*} item
 * @param {*} updater
 */
export declare function update_object<T extends object>(item: T, updater: IUpdatePartial<T>): [number, T];
