const {derived, readable, writable} = require("svelte/store");

const {immutable} = require("../../lib/stores/shared/immutable");

const initial_value = {key: "value"};

(() => {
    const readable_store = readable(initial_value);

    const store = immutable(readable_store);

    store.subscribe((value) => {
        console.log({initial_value, value});
        console.log(value === initial_value);
    }); // logs: `false`
})();

(() => {
    const writable_store = writable(initial_value);

    const store = immutable(writable_store);

    // NOTE: A `derived` Store is used here for simpler looking code
    const derived_store = derived([writable_store, store], ([$writable, $store]) => {
        console.log({$writable, $store});
        console.log($writable === $store);
    });

    // NOTE: This subscription is just so the `derived` callback starts running
    derived_store.subscribe(() => {}); // logs: `false`

    store.set({key: "not a value!"}); // logs: `false`
})();
