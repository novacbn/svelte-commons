import { JsonSchema } from "tv4";
import { Writable } from "svelte/store";
import { IJSONType } from "../../util/shared/builtin";
import { IStoreStartStopNotifier } from "../../util/shared/stores";
/**
 * Returns a `Writable` Svelte Store, that validates values set to the Store, and retrieved via subscriptions against a JSON Schema
 * @param store
 * @param schema
 * @param start
 */
export declare function schema<T extends IJSONType>(store: T | Writable<T>, schema: JsonSchema, start?: IStoreStartStopNotifier<T>): Writable<T>;
