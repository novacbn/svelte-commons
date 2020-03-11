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
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("svelte/store");
/**
 * Returns the two objects merged with each other
 * @param previous_object
 * @param new_object
 */
function merge(previous_object, new_object) {
    return __assign(__assign({}, previous_object), new_object);
}
/**
 * Represents a `Writable` Svelte Store for a Store that performs shallow delta updates to the current object
 *
 * **Without Custom "Merger"**
 *
 * ```javascript
 * import {merged} from "svelte-commons/lib/stores/shared";
 *
 * // The Store is initialized with an empty base object, which is immutable by default
 * const store = merged({});
 *
 * // Will log every change to the Store
 * store.subscribe(console.log);
 *
 * store.set({first_name: "John", last_name: "Smith"}); // logs: `{first_name: "John", last_name: "Smith"}`
 * store.set({first_name: "Jane"}); // logs: `{first_name: "Jane", last_name: "Smith"}`
 * ```
 *
 * **With Custom "Merger"**
 *
 * ```javascript
 * import {merged} from "svelte-commons/lib/stores/shared";
 *
 * const initial_data = {
 *     name: "James Bond",
 *     job: {
 *         title: "Spy",
 *         agency: "MI6",
 *         country: "England"
 *     }
 * };
 *
 * function merger(a, b) {
 *     // By default, the default "Merger" only merges the top-level object keys, and spreads
 *     // all of them. For more performance, and to target nested keys, we can use a custom function
 *     const { name: a_name, job: a_job = {} } = a;
 *     const { name: b_name, job: b_job = {} } = b;
 *
 *     return {
 *         name: b_name || a_name,
 *         job: {
 *             title: b_job.title || a_job.title,
 *             agency: b_job.agency || a_job.agency,
 *             country: b_job.country || a_job.country
 *         }
 *     };
 * }
 *
 * // The Store is initialized with an empty base object, which is immutable by default
 * const store = merged(initial_data, merger);
 *
 * // Will log every change to the Store
 * store.subscribe(console.log); // logs: `{name:"James Bond",job:{title:"Spy",agency:"MI6",country:"England"}}`
 *
 * store.set({job: {agency: "FBI", country: "USA"}}); // logs: `{name:"James Bond",job:{title:"Spy",agency:"FBI",country:"USA"}}`
 * ```
 *
 * @param {*} value
 * @param {*} start
 */
function merged(value, merger, start) {
    if (merger === void 0) { merger = merge; }
    var _a = store_1.writable(value, start), set = _a.set, subscribe = _a.subscribe, update = _a.update;
    return {
        subscribe: subscribe,
        set: function (new_value) {
            value = merger(value, new_value);
            set(value);
        },
        update: function (func) {
            update(function (value) {
                return merger(value, func(value));
            });
        }
    };
}
exports.merged = merged;
//# sourceMappingURL=merged.js.map