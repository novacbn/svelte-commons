"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("svelte/store");
var stores_1 = require("../../util/shared/stores");
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
function immutable_readable(value, clone, start) {
    var store;
    // We need to support both creation of a `Readable` Store,
    // and wrapping of an existing `Readable` Store
    if (stores_1.is_readable(value)) {
        store = value;
    }
    else {
        var _start = function (set) {
            function _set(value) {
                value = clone(value);
                set(value);
            }
            return start(_set);
        };
        value = clone(value);
        store = store_1.readable(value, _start);
    }
    var subscribe = store.subscribe;
    var _subscribe = function (run, invalidate) {
        var _run = function (value) {
            value = clone(value);
            run(value);
        };
        return subscribe(_run, invalidate);
    };
    return { subscribe: _subscribe };
}
exports.immutable_readable = immutable_readable;
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
function immutable_writable(value, clone, start) {
    var store;
    if (stores_1.is_writable(value)) {
        store = value;
    }
    else {
        var _start = void 0;
        if (start) {
            _start = function () {
                var _set = function (value) {
                    value = clone(value);
                    set(value);
                };
                return start(_set);
            };
        }
        value = clone(value);
        store = store_1.writable(value, _start);
    }
    var set = store.set, subscribe = store.subscribe, update = store.update;
    var _set = function (value) {
        value = clone(value);
        set(value);
    };
    var _subscribe = function (run, invalidate) {
        var _run = function (value) {
            value = clone(value);
            run(value);
        };
        return subscribe(_run, invalidate);
    };
    var _update = function (updater) {
        var _updater = function (value) {
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
exports.immutable_writable = immutable_writable;
//# sourceMappingURL=immutable.js.map