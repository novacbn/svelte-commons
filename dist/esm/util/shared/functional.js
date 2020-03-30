var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/**
 * Represents a sorting comparator for sorting between the keys in a `Object.entries` Array output
 *
 * @internal
 *
 * @param entry_a
 * @param entry_b
 */
export function comparator_entries(_a, _b) {
    var _c = __read(_a, 1), key_a = _c[0];
    var _d = __read(_b, 1), key_b = _d[0];
    key_a = key_a.toLowerCase();
    key_b = key_b.toLowerCase();
    if (key_a >= key_b)
        return 1;
    else if (key_b >= key_a)
        return -1;
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
export function diff_count(object_a, object_b) {
    var e_1, _a;
    var updates = 0;
    var keys = new Set(__spread(Object.keys(object_a), Object.keys(object_b)));
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            if (object_a[key] !== object_b[key])
                updates += 1;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_1) throw e_1.error; }
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
export function filter_collection(array, predicate) {
    if (typeof predicate === "function") {
        return array.filter(function (item, index) {
            return predicate(item, index);
        });
    }
    else if (typeof predicate === "number") {
        return array.filter(function (item, index) {
            return index === predicate;
        });
    }
    else if (predicate !== null && typeof predicate !== "undefined") {
        return array.filter(function (item, index) {
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
export function find_collection(array, predicate) {
    if (typeof predicate === "function") {
        return array.find(function (item, index) {
            return predicate(item, index);
        });
    }
    else if (typeof predicate === "number") {
        return array[predicate];
    }
    else if (predicate !== null && typeof predicate !== "undefined") {
        return array.find(function (item) { return match_predicate(item, predicate); });
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
export function is_falsy(value) {
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
export function map_collection(array, mapper) {
    if (typeof mapper === "function") {
        return array.map(function (item, index) {
            return mapper(item, index);
        });
    }
    return array.map(function (item) {
        return __assign(__assign({}, item), mapper);
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
export function match_predicate(item, predicate) {
    for (var key in predicate) {
        if (item[key] !== predicate[key])
            return false;
    }
    return true;
}
/**
 * Returns the filtered `array` element, that naively DOES NOT match the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
export function reject_collection(array, predicate) {
    if (typeof predicate === "function") {
        return array.filter(function (item, index) {
            return !predicate(item, index);
        });
    }
    else if (typeof predicate === "number") {
        return array.filter(function (item, index) {
            return index !== predicate;
        });
    }
    else if (predicate !== null && typeof predicate !== "undefined") {
        return array.filter(function (item, index) {
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
export function update_object(item, updater) {
    var _item;
    if (typeof updater === "object") {
        _item = __assign(__assign({}, item), updater);
    }
    else {
        _item = __assign(__assign({}, item), updater(item));
    }
    var updates = diff_count(item, _item);
    return [updates, _item];
}
//# sourceMappingURL=functional.js.map