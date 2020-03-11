"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tv4_1 = require("tv4");
var store_1 = require("svelte/store");
var stores_1 = require("../../util/shared/stores");
/**
 * Returns a `Readable` / `Writable` Svelte Store, that validates values set to the Store, and retrieved via subscriptions, against a JSON Schema
 * @param store
 * @param schema
 * @param start
 */
function schema(store, json_schema, start) {
    if (!stores_1.is_writable(store)) {
        store = store_1.writable(store, start);
    }
    function _validate(value) {
        if (tv4_1.default.validate(value, json_schema))
            return true;
        var _a = json_schema.title, title = _a === void 0 ? "UntitledSchema" : _a;
        var _b = tv4_1.default.error, dataPath = _b.dataPath, message = _b.message;
        throw new TypeError("bad change '" + title + dataPath + "' to Schema Store (" + message + ")");
    }
    if (stores_1.is_writable(store)) {
        var _a = store, set_1 = _a.set, subscribe_1 = _a.subscribe, update_1 = _a.update;
        return {
            set: function (value) {
                _validate(value);
                set_1(value);
            },
            subscribe: function (run, invalidate) {
                var _run = function (value) {
                    _validate(value);
                    run(value);
                };
                return subscribe_1(_run, invalidate);
            },
            update: function (updater) {
                update_1(function (value) {
                    value = updater(value);
                    _validate(value);
                    return value;
                });
            }
        };
    }
    else {
        var subscribe_2 = store.subscribe;
        return {
            subscribe: function (run, invalidate) {
                var _run = function (value) {
                    _validate(value);
                    run(value);
                };
                return subscribe_2(_run, invalidate);
            }
        };
    }
}
exports.schema = schema;
//# sourceMappingURL=schema.js.map