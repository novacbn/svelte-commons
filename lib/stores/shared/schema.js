"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tv4_1 = require("tv4");
var store_1 = require("svelte/store");
var stores_1 = require("../../util/shared/stores");
/**
 * Returns a `Writable` Svelte Store, that validates values set to the Store, and retrieved via subscriptions against a JSON Schema
 * @param store
 * @param schema
 * @param start
 */
function schema(store, schema, start) {
    if (!stores_1.is_writable(store)) {
        store = store_1.writable(store, start);
    }
    var _a = store, set = _a.set, subscribe = _a.subscribe, update = _a.update;
    function _validate(value) {
        if (tv4_1.validate(value, schema))
            return true;
        var _a = tv4_1.default.error, dataPath = _a.dataPath, message = _a.message, schemaPath = _a.schemaPath;
        throw new TypeError("bad change '" + dataPath + "' in Schema Store (property '" + schemaPath + "' errored with '" + message + "')");
    }
    return {
        set: function (value) {
            _validate(value);
            set(value);
        },
        subscribe: function (run, invalidate) {
            run = function (value) {
                _validate(value);
                run(value);
            };
            return subscribe(run, invalidate);
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