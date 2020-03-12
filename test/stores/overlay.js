const {writable} = require("svelte/store");

const {overlay} = require("../../lib/stores/shared/overlay");

const raw_store = writable("");

const store = overlay(
    raw_store,
    (value) => JSON.parse(value),
    (value) => JSON.stringify(value)
);

raw_store.subscribe(console.log); // logs: ``

store.set({hello: `world`}); // logs: `{"hello":"world"}`
