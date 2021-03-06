/**
 * Represents the predicate filter, function, or `Array` index used in `filter_collection` / `find_collection` / `reject_collection`
 */
export type IPredicatePartial<T> = ((value: T, index: number) => boolean) | Partial<T> | number;

/**
 * Represents the mapping value or function used in `map_collection`
 */
export type IMapperPartial<T> = ((value: T, index: number) => Partial<T>) | Partial<T>;

/**
 * Represents the updating value or function used in `update_value`
 */
export type IUpdatePartial<T> = ((value: T) => Partial<T>) | Partial<T>;

/**
 * Represents a entry from an object that was processed via `Object.entries`
 */
export type IObjectEntry<T> = [string, T];

/**
 * Represents a sorting comparator for sorting between the keys in a `Object.entries` Array output
 *
 * @internal
 *
 * @param entry_a
 * @param entry_b
 */
export function comparator_entries([key_a]: IObjectEntry<any>, [key_b]: IObjectEntry<any>): number {
    key_a = key_a.toLowerCase();
    key_b = key_b.toLowerCase();

    if (key_a >= key_b) return 1;
    else if (key_b >= key_a) return -1;

    return 0;
}

/**
 * Returns the number of non-identity `!==` hits between the key-values of each object
 *
 * @internal
 *
 * @param object_a
 * @param object_b
 */
export function diff_count(object_a: {[key: string]: any}, object_b: {[key: string]: any}): number {
    let updates = 0;
    const keys: Set<string> = new Set([...Object.keys(object_a), ...Object.keys(object_b)]);

    for (const key of keys) {
        if (object_a[key] !== object_b[key]) updates += 1;
    }

    return updates;
}

/**
 * Returns the filtered `array` element, that naively matches the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
export function filter_collection<T extends object>(
    array: T[],
    predicate?: IPredicatePartial<T> | null
): T[] {
    if (typeof predicate === "function") {
        return array.filter((item, index) => {
            return predicate(item, index);
        });
    } else if (typeof predicate === "number") {
        return array.filter((item, index) => {
            return index === predicate;
        });
    } else if (predicate !== null && typeof predicate !== "undefined") {
        return array.filter((item, index) => {
            return match_predicate(item, predicate);
        });
    }

    // If the `predicate` did not match any of our accepted
    // types, just default to noop
    return array;
}

/**
 * Returns the first `array` element that, naively matches the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
export function find_collection<T extends object>(
    array: T[],
    predicate?: IPredicatePartial<T> | null
): T | undefined {
    if (typeof predicate === "function") {
        return array.find((item, index) => {
            return predicate(item, index);
        });
    } else if (typeof predicate === "number") {
        return array[predicate];
    } else if (predicate !== null && typeof predicate !== "undefined") {
        return array.find((item) => match_predicate(item, predicate));
    }

    return array[0];
}

/**
 * Returns true if the passed in `value` is `undefined`, `null`, `""`, or `false`
 *
 * @internal
 *
 * @param value
 */
export function is_falsy(value: any): boolean {
    return typeof value === "undefined" || value === false || value === null || value === "";
}

/**
 * Returns the a new Array of elements from `array`, with using `mapper` to remap each element
 *
 * @internal
 *
 * @param {*} array
 * @param {*} mapper
 */
export function map_collection<T extends object>(array: T[], mapper: IMapperPartial<T>): T[] {
    if (typeof mapper === "function") {
        return array.map((item, index) => {
            return mapper(item, index);
        }) as T[];
    }

    return array.map((item) => {
        return {...item, ...mapper};
    });
}

/**
 * Returns true if the key-values in `predicate` match that of `item`
 *
 * @internal
 *
 * @param item
 * @param predicate
 */
export function match_predicate<T extends object>(item: T, predicate: Partial<T>): boolean {
    for (const key in predicate) {
        if (item[key] !== predicate[key]) return false;
    }

    return true;
}

/**
 * Returns nothing and takes no arguments, used for dummy function placeholders
 */
export function noop(): void {}

/**
 * Returns the filtered `array` element, that naively DOES NOT match the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
export function reject_collection<T extends object>(
    array: T[],
    predicate?: IPredicatePartial<T> | null
): T[] {
    if (typeof predicate === "function") {
        return array.filter((item, index) => {
            return !predicate(item, index);
        });
    } else if (typeof predicate === "number") {
        return array.filter((item, index) => {
            return index !== predicate;
        });
    } else if (predicate !== null && typeof predicate !== "undefined") {
        return array.filter((item, index) => {
            return !match_predicate(item, predicate);
        });
    }

    // If the `predicate` did not match any of our accepted
    // types, just default to noop
    return array;
}

/**
 * Returns the updated `item`, with using `updater` to remap the any values
 *
 * @internal
 *
 * @param {*} item
 * @param {*} updater
 */
export function update_object<T extends object>(item: T, updater: IUpdatePartial<T>): [number, T] {
    let _item: T;

    if (typeof updater === "object") {
        _item = {...item, ...updater};
    } else {
        _item = {...item, ...updater(item)};
    }

    const updates = diff_count(item, _item);

    return [updates, _item];
}
