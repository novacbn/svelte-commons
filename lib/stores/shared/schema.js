"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tv4_1 = __importDefault(require("tv4"));
var store_1 = require("svelte/store");
var stores_1 = require("../../util/shared/stores");
var overlay_1 = require("./overlay");
/**
 * Returns a `Readable` / `Writable` Svelte Store, that validates values set to the Store, and retrieved via subscriptions, against a JSON Schema
 *
 * **NOTE**: If a non-Store value is passed as `store`, then it will be wrapped in a `Writable` Store
 *
 * ```javascript
 * import {schema} from "svelte-commons/lib/stores/shared";
 *
 * // Here, we're defining our JSONSchema that will validate our I/O
 * //
 * // Check out for more information: https://json-schema.org/
 * const person_schema = {
 *     $id: "https://example.com/person.schema.json",
 *     $schema: "http://json-schema.org/draft-07/schema#",
 *     title: "Person",
 *     type: "object",
 *     properties: {
 *         firstName: {
 *             type: "string",
 *             description: "The person's first name."
 *         },
 *
 *         lastName: {
 *             type: "string",
 *             description: "The person's last name."
 *         },
 *
 *         age: {
 *             description: "Age in years which must be equal to or greater than zero.",
 *             type: "integer",
 *             minimum: 0
 *         }
 *     }
 * };
 *
 * // We need to seed our with an initial value, so here's a sample person
 * const initial_person = {
 *     firstName: "John",
 *     lastName: "Smith",
 *     age: 32
 * };
 *
 * // Now we just pass our initial data and our JSON Schema in
 * const store = schema(initial_person, person_schema);
 *
 * // To demonstrate changes, we need to log each change
 * store.subscribe(console.log); // logs: `{firstName: "John", lastName: "Smith", age: 32}`
 *
 * // Here, we're copying our initial "Person", then updating its age to `21`
 * store.set({...initial_person, age: 21}); // logs: `{firstName: "John", lastName: "Smith", age: 21}`
 *
 * // Same as above, but using a negative `.age` to have an exception thrown
 * store.set({...initial_person, age: -60}); // throws exception: `Uncaught TypeError: bad change 'Person/age' to Schema Store (Value -60 is less than minimum 0)`
 * ```
 *
 * @param store
 * @param schema
 * @param start
 */
function schema(store, json_schema, start) {
    // Need to support raw non-Store values being passed, so
    // we wrap them in a `Writable` Store
    if (!stores_1.is_readable(store))
        store = store_1.writable(store, start);
    function _validate(value) {
        if (tv4_1.default.validate(value, json_schema))
            return value;
        var _a = json_schema.title, title = _a === void 0 ? "UntitledSchema" : _a;
        var _b = tv4_1.default.error, dataPath = _b.dataPath, message = _b.message;
        throw new TypeError("bad change '" + title + dataPath + "' to Schema Store (" + message + ")");
    }
    if (stores_1.is_writable(store))
        return overlay_1.overlay(store, _validate, _validate);
    return store_1.derived(store, _validate);
}
exports.schema = schema;
//# sourceMappingURL=schema.js.map