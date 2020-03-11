"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tv4_1 = require("tv4");
var store_1 = require("svelte/store");
var stores_1 = require("../../util/shared/stores");
/**
 * Returns a `Writable` Svelte Store, that validates values set to the Store, and retrieved via subscriptions, against a JSON Schema
 * @param store
 * @param schema
 * @param start
 */
function schema(store, json_schema, start) {
    if (!stores_1.is_writable(store)) {
        store = store_1.writable(store, start);
    }
    var _a = store, set = _a.set, subscribe = _a.subscribe, update = _a.update;
    function _validate(value) {
        if (tv4_1.default.validate(value, json_schema))
            return true;
        var _a = json_schema.title, title = _a === void 0 ? "UntitledSchema" : _a;
        var _b = tv4_1.default.error, dataPath = _b.dataPath, message = _b.message;
        throw new TypeError("bad change '" + title + dataPath + "' in Schema Store (" + message + ")");
    }
    return {
        set: function (value) {
            _validate(value);
            set(value);
        },
        subscribe: function (run, invalidate) {
            var _run = function (value) {
                _validate(value);
                run(value);
            };
            return subscribe(_run, invalidate);
        },
        update: function (updater) {
            update(function (value) {
                var new_value = updater(value);
                _validate(new_value);
                return new_value;
            });
        }
    };
}
exports.schema = schema;
//# sourceMappingURL=schema.js.map