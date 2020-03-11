import { Writable } from "svelte/store";
import { IStoreStartStopNotifier } from "../../util/shared/stores";
/**
 * Represents the "merger" function that combines the new object, with the previous object. Overwritting existing keys
 */
export declare type IMerger<T extends object> = (previous_object: T, new_object: T) => T;
/**
 * Represents a `Writable` Svelte Store for a Store that performs shallow delta updates to the current object
 *
 * **Without Custom "Merger"**
 *
 * ```javascript
 * import {merged} from "svelte-commons/lib/stores/shared";
 *
 * // The Store is initialized with an empty base object, which is immutable by default
 * const store = merged({});
 *
 * // Will log every change to the Store
 * store.subscribe(console.log);
 *
 * store.set({first_name: "John", last_name: "Smith"}); // logs: `{first_name: "John", last_name: "Smith"}`
 * store.set({first_name: "Jane"}); // logs: `{first_name: "Jane", last_name: "Smith"}`
 * ```
 *
 * **With Custom "Merger"**
 *
 * ```javascript
 * import {merged} from "svelte-commons/lib/stores/shared";
 *
 * const initial_data = {
 *     name: "James Bond",
 *     job: {
 *         title: "Spy",
 *         agency: "MI6",
 *         country: "England"
 *     }
 * };
 *
 * function merger(a, b) {
 *     // By default, the default "Merger" only merges the top-level object keys, and spreads
 *     // all of them. For more performance, and to target nested keys, we can use a custom function
 *     const { name: a_name, job: a_job = {} } = a;
 *     const { name: b_name, job: b_job = {} } = b;
 *
 *     return {
 *         name: b_name || a_name,
 *         job: {
 *             title: b_job.title || a_job.title,
 *             agency: b_job.agency || a_job.agency,
 *             country: b_job.country || a_job.country
 *         }
 *     };
 * }
 *
 * // The Store is initialized with an empty base object, which is immutable by default
 * const store = merged(initial_data, merger);
 *
 * // Will log every change to the Store
 * store.subscribe(console.log); // logs: `{name:"James Bond",job:{title:"Spy",agency:"MI6",country:"England"}}`
 *
 * store.set({job: {agency: "FBI", country: "USA"}}); // logs: `{name:"James Bond",job:{title:"Spy",agency:"FBI",country:"USA"}}`
 * ```
 *
 * @param {*} value
 * @param {*} start
 */
export declare function merged<T extends object>(value: T, merger?: IMerger<T>, start?: IStoreStartStopNotifier<T>): Writable<T>;
