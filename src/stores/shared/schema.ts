import tv4, {JsonSchema, validate} from "tv4";
import {Writable, writable} from "svelte/store";

import {IJSONType} from "../../util/shared/builtin";
import {IStoreStartStopNotifier, is_writable} from "../../util/shared/stores";

/**
 * Returns a `Writable` Svelte Store, that validates values set to the Store, and retrieved via subscriptions against a JSON Schema
 * @param store
 * @param schema
 * @param start
 */
export function schema<T extends IJSONType>(
    store: T | Writable<T>,
    schema: JsonSchema,
    start?: IStoreStartStopNotifier<T>
): Writable<T> {
    if (!is_writable(store)) {
        store = writable(store, start) as Writable<T>;
    }

    const {set, subscribe, update} = store as Writable<T>;

    function _validate(value: T) {
        if (validate(value, schema)) return true;

        const {dataPath, message, schemaPath} = tv4.error;

        throw new TypeError(
            `bad change '${dataPath}' in Schema Store (property '${schemaPath}' errored with '${message}')`
        );
    }

    return {
        set(value) {
            _validate(value);
            set(value);
        },

        subscribe(run, invalidate) {
            run = (value) => {
                _validate(value);
                run(value);
            };

            return subscribe(run, invalidate);
        },

        update(updater) {
            update((value) => {
                const new_value = updater(value);

                _validate(new_value);
                return new_value;
            });
        }
    };
}
