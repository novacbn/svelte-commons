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
import { get, writable } from "svelte/store";
import { filter_collection, find_collection, map_collection, reject_collection, update_object } from "../../util/shared/functional";
/**
 * Returns a `Writable` Svelte Store that implements [[ICollectionStore]] for interacting with an `Array` of `Object`s
 * @param store
 * @param start
 */
export function collection(store, start) {
    if (store === void 0) { store = []; }
    // Need to support end-developers passing in both initial arrays and stores
    if (Array.isArray(store))
        store = writable(store, start);
    var update = store.update, set = store.set, subscribe = store.subscribe;
    var filter = function (predicate, mutate) {
        if (mutate === void 0) { mutate = false; }
        var array = get(store);
        array = filter_collection(array, predicate);
        if (mutate)
            set(array);
        return array;
    };
    var find = function (predicate) {
        var array = get(store);
        var item = find_collection(array, predicate);
        return item;
    };
    var _get = function () { return get(store); };
    var map = function (mapper, mutate) {
        if (mutate === void 0) { mutate = false; }
        var array = get(store);
        array = map_collection(array, mapper);
        if (mutate)
            set(array);
        return array;
    };
    var push = function (item) {
        var array = get(store);
        var index = array.push(item);
        set(array);
        return index;
    };
    var reject = function (predicate, mutate) {
        if (mutate === void 0) { mutate = false; }
        var array = get(store);
        array = reject_collection(array, predicate);
        if (mutate)
            set(array);
        return array;
    };
    var remove = function (index) {
        var array = get(store);
        if (typeof array[index] === "undefined") {
            throw new ReferenceError("bad dispatch to 'collection.remove_item' (no item at index '" + index + "')");
        }
        var _a = __read(array.splice(index, 1), 1), item = _a[0];
        set(array);
        return __assign({}, item);
    };
    var set_item = function (predicate, updater) {
        var array = get(store);
        var item = find_collection(array, predicate);
        if (!item) {
            throw new ReferenceError("bad dispatch to 'collection.set_item' (no items match predicate)");
        }
        // If there were no updates performed on the target
        // item, then we can skip and return the copy
        var _a = __read(update_object(item, updater), 2), updates = _a[0], _item = _a[1];
        if (updates < 1)
            return _item;
        var index = 0;
        for (var _index in array) {
            if (array[_index] === item) {
                index = parseInt(_index);
                break;
            }
        }
        array[index] = _item;
        set(array);
        return __assign({}, _item);
    };
    return {
        update: update,
        set: set,
        subscribe: subscribe,
        filter: filter,
        find: find,
        map: map,
        push: push,
        reject: reject,
        remove: remove,
        set_item: set_item,
        get: _get
    };
}
//# sourceMappingURL=collection.js.map