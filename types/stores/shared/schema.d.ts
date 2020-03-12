import { JsonSchema } from "tv4";
import { Readable, Writable } from "svelte/store";
import { IJSONType } from "../../util/shared/builtin";
import { IStoreStartStopNotifier } from "../../util/shared/stores";
/**
 * Returns a `Readable` / `Writable` Svelte Store, that validates values set to the Store, and retrieved via subscriptions, against a JSON Schema
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
 * @param value
 * @param schema
 * @param start
 */
export declare function schema<T extends IJSONType>(store: T | Readable<T> | Writable<T>, json_schema: JsonSchema, start?: IStoreStartStopNotifier<T>): Readable<T> | Writable<T>;
