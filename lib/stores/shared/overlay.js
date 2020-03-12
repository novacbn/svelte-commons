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
/**
 * Returns a new `Writable` Svelte Store that has it's I/O overlaid with the `read` function for `.subscribe` / `.update` and `.write` function for `.set` / `.update`
 *
 * ```javascript
 * import {writable} from "svelte/store";
 *
 * import {overlay} from "svelte-commons/lib/stores/shared/overlay";
 *
 * // For the base Store, it's going to maintain the JSON-encoded view of data
 * // passed in. So we need to default it to an empty string
 * const raw_store = writable("");
 *
 * // Here, we're creating a `Writable` "overlay" Store, which will encode all
 * // inputs to JSON before writing to the base Store. And then parse all values
 * // from the base Store as JSON, for subscriptions and updater functions
 * const store = overlay(
 *     raw_store,
 *     (value) => JSON.parse(value),
 *     (value) => JSON.stringify(value)
 * );
 *
 * raw_store.subscribe(console.log); // logs: ``
 *
 * // As you can see when `.set` is ran, our base Store's logger
 * // shows the JSON-encoded data
 * store.set({hello: "world"}); // logs: `{"hello":"world"}`
 * ```
 *
 * @param store
 * @param read
 * @param write
 */
function overlay(store, read, write) {
    var set = store.set, subscribe = store.subscribe, update = store.update;
    return __assign(__assign({}, store), { set: function (value) {
            value = write(value);
            set(value);
        },
        subscribe: function (run, invalidate) {
            var _run = function (value) {
                value = read(value);
                run(value);
            };
            return subscribe(_run, invalidate);
        },
        update: function (updater) {
            update(function (value) {
                value = read(value);
                value = updater(value);
                return write(value);
            });
        } });
}
exports.overlay = overlay;
//# sourceMappingURL=overlay.js.map