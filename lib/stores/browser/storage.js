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
var context_1 = require("../../util/shared/context");
/**
 * Returns the standardized defaults for options passed into `storage` Store
 *
 * @internal
 *
 * @param options
 */
function StorageOptions(options) {
    if (options === void 0) { options = {}; }
    return __assign({ event: undefined, event_source: undefined, prefix: "svelte-commons." }, options);
}
/**
 * Returns a `Readable` (Server) / `Writable` (Browser) Svelte Store with a reactive binding to a given `Storage` adapter
 *
 * NOTE: Only **JSON-compatible** values are supported
 *
 * As a semi-complete example:
 *
 * ```javascript
 * import {get} from "svelte/store";
 *
 * import {storage} from "svelte-commons/lib/stores/browser";
 *
 * // Below, creating a factory function wrapper around the `localStorage` Web Storage API
 * const local_storage = storage(window.localStorage, {
 *     // Both `event` and `event_source` tells the Store what event string to
 *     // listen to and what `EventTarget` to listen from for tab-sync
 *     event: "storage",
 *     event_source: window,
 *
 *     // `.prefix` tells the Store to prefix all storage keys with a specific string (defaults to `svelte-commons.`)
 *     prefix: "my_key_prefix."
 * });
 *
 * // Now we can use our new `local_storage` factory to make a reactive Store binding
 * // to a specific `localStorage` key.
 * const store = local_storage("my_string_key", "I am default");
 *
 * // Using `get`, we can see the Store is already at its default
 * console.log(get(store)); // logs: `I am default`
 *
 * // Since there is nothing set yet, the actual localStorage key is empty
 * console.log(window.localStorage.getItem("my_key_prefix.my_string_key")) // logs: `null`
 *
 * // After setting a value, both the Store and `localStorage` have the same value
 * store.set("But, this is not default");
 * console.log(
 *     get(store),
 *     window.localStorage.getItem("my_key_prefix.my_string_key")
 * ); // logs: `But, this is not default`, `"But, this is not default"`
 *
 * // By setting the Store to the default value OR `undefined`, the
 * // `localStorage` item is removed
 * store.set("I am default");
 *
 * console.log(
 *     get(store),
 *     window.localStorage.getItem("my_key_prefix.my_string_key")
 * ); // logs: `I am default`, `null`
 * ```
 *
 * @param adapter
 * @param options
 */
function storage(adapter, options) {
    if (options === void 0) { options = {}; }
    var _a = StorageOptions(options), event = _a.event, event_source = _a.event_source, prefix = _a.prefix;
    return function (key, default_value) {
        if (!context_1.CONTEXT_IS_BROWSER)
            return store_1.readable(default_value, function () { });
        if (prefix)
            key = prefix + key;
        var stored_value = adapter.getItem(key);
        var parsed_value = stored_value ? JSON.parse(stored_value) : default_value;
        var store = store_1.writable(parsed_value, function (set) {
            var _a;
            function on_change(event) {
                event: StorageEvent = event.detail ? event.detail : event;
                if (event.storageArea !== adapter || event.key !== key)
                    return;
                if (event.newValue)
                    set(JSON.parse(event.newValue));
                else
                    set(default_value);
            }
            if (event) {
                (_a = event_source) === null || _a === void 0 ? void 0 : _a.addEventListener(event, on_change);
                return function () { var _a; return (_a = event_source) === null || _a === void 0 ? void 0 : _a.removeEventListener(event, on_change); };
            }
        });
        store.subscribe(function (value) {
            if (value === default_value || typeof value === "undefined")
                adapter.removeItem(key);
            else
                adapter.setItem(key, JSON.stringify(value));
        });
        return store;
    };
}
exports.storage = storage;
/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.localStorage`
 *
 * NOTE: Only **JSON-compatible** values are supported
 *
 * As a minimal example:
 *
 * ```javascript
 * import {local_storage} from "svelte-commons/lib/stores/browser";
 *
 * const store = local_storage("my_string_key", "some default string");
 *
 * store.subscribe((value) => {
 *     console.log(value);
 * }); // Will log any changes to the Store
 *
 * store.set("a non-default string"); // logs: `a non-default string`
 *
 * console.log(
 *     window.localStorage.getItem("svelte-commons.my_string_key")
 * ); // logs: `"a non-default string"`
 * ```
 */
exports.local_storage = storage(localStorage, {
    event: "storage",
    event_source: window
});
/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.sessionStorage`
 *
 * NOTE: Only **JSON-compatible** values are supported
 *
 * As a minimal example:
 *
 * ```javascript
 * import {session_storage} from "svelte-commons/lib/stores/browser";
 *
 * const store = session_storage("my_string_key", "some default string");
 *
 * store.subscribe((value) => {
 *     console.log(value);
 * }); // Will log any changes to the Store
 *
 * store.set("a non-default string"); // logs: `a non-default string`
 *
 * console.log(
 *     window.sessionStorage.getItem("svelte-commons.my_string_key")
 * ); // logs: `"a non-default string"`
 * ```
 */
exports.session_storage = storage(sessionStorage, {
    event: "storage",
    event_source: window
});
//# sourceMappingURL=storage.js.map