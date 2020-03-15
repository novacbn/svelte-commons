"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("svelte/store");
var location_1 = require("../../util/browser/location");
var overlay_1 = require("../shared/overlay");
/**
 * Returns the options passable into the [[hash]], [[pathname]], or [[search]] Svelte Stores, with standard defaults
 *
 * @internal
 *
 * @param options
 */
function LocationOptions(options) {
    if (options === void 0) { options = {}; }
    var _a = options.hash, hash = _a === void 0 ? false : _a, _b = options.readonly, readonly = _b === void 0 ? false : _b, _c = options.replace, replace = _c === void 0 ? false : _c;
    return { hash: hash, readonly: readonly, replace: replace };
}
/**
 * Returns a factory function, for binding a [`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location) component into a `Writable` Svelte Store
 *
 * @internal
 *
 * @param component
 */
function make_location_store(component) {
    return function (options) {
        var _a = LocationOptions(options), hash = _a.hash, readonly = _a.readonly, replace = _a.replace;
        function get_value() {
            var url = location_1.get_location_url(hash);
            return url[component];
        }
        function on_start(set) {
            function on_popstate(event) {
                set(get_value());
            }
            set(get_value());
            window.addEventListener("popstate", on_popstate);
            return function () {
                window.removeEventListener("popstate", on_popstate);
            };
        }
        if (readonly)
            return store_1.readable(get_value(), on_start);
        function set_value(value) {
            var url = location_1.get_location_url(hash);
            url[component] = value;
            location_1.update_location_url(url, hash, replace);
        }
        var store = store_1.writable(get_value(), on_start);
        return overlay_1.overlay(store, function (value) { return value; }, function (value) {
            set_value(value);
            return value;
        });
    };
}
/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.hash`](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) component
 *
 * @param options
 */
exports.hash = make_location_store("hash");
/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) component
 *
 * @param options
 */
exports.pathname = make_location_store("pathname");
/**
 * Returns a `Writable` Svelte Store, which binds to the [`Location.search`](https://developer.mozilla.org/en-US/docs/Web/API/Location/search) component
 *
 * @param options
 */
exports.search = make_location_store("search");
//# sourceMappingURL=location.js.map