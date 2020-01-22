"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the number of non-identity `!==` hits between the key-values of each object
 *
 * @internal
 *
 * @param object_a
 * @param object_b
 */
function diff_count(object_a, object_b) {
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
exports.diff_count = diff_count;
/**
 * Returns the filtered `array` element, that naively matches the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
function filter_collection(array, predicate) {
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
exports.filter_collection = filter_collection;
/**
 * Returns the first `array` element that, naively matches the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
function find_collection(array, predicate) {
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
exports.find_collection = find_collection;
/**
 * Returns true if the passed in `value` is `false`, `undefined`, or `null`
 *
 * @internal
 *
 * @param value
 */
function is_falsy(value) {
    return typeof value === "undefined" || value === false || value === null;
}
exports.is_falsy = is_falsy;
/**
 * Returns the a new Array of elements from `array`, with using `mapper` to remap each element
 *
 * @internal
 *
 * @param {*} array
 * @param {*} mapper
 */
function map_collection(array, mapper) {
    if (typeof mapper === "function") {
        return array.map(function (item, index) {
            return mapper(item, index);
        });
    }
    return array.map(function (item) {
        return __assign(__assign({}, item), mapper);
    });
}
exports.map_collection = map_collection;
/**
 * Returns true if the key-values in `predicate` match that of `item`
 *
 * @internal
 *
 * @param item
 * @param predicate
 */
function match_predicate(item, predicate) {
    for (var key in predicate) {
        if (item[key] !== predicate[key])
            return false;
    }
    return true;
}
exports.match_predicate = match_predicate;
/**
 * Returns the filtered `array` element, that naively DOES NOT match the `predicate`
 *
 * @internal
 *
 * @param array
 * @param predicate
 */
function reject_collection(array, predicate) {
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
exports.reject_collection = reject_collection;
/**
 * Returns the updated `item`, with using `updater` to remap the any values
 *
 * @internal
 *
 * @param {*} item
 * @param {*} updater
 */
function update_object(item, updater) {
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
exports.update_object = update_object;
//# sourceMappingURL=functional.js.map