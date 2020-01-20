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
 * @param options
 */
function StorageOptions(options) {
    if (options === void 0) { options = {}; }
    return __assign({ event: undefined, event_source: undefined, prefix: "svelte-commons." }, options);
}
/**
 * Returns a `Readable` (Server) / `Writable` (Browser) Svelte Store with a reactive binding to a given `Storage` adapter
 *
 * ```javascript
 * TODO:
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
 * ```javascript
 * TODO:
 * ```
 */
exports.local_storage = storage(localStorage, {
    event: "storage",
    event_source: window
});
/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.sessionStorage`
 *
 * ```javascript
 * TODO:
 * ```
 */
exports.session_storage = storage(sessionStorage, {
    event: "storage",
    event_source: window
});
//# sourceMappingURL=storage.js.map