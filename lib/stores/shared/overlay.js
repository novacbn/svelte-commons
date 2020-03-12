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