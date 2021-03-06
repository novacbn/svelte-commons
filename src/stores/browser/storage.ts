import {storage} from "../shared/storage";

/**
 * Represents the current global object, Window (Browser) / Global (Server)
 */
const global = typeof window !== "undefined" ? window : this;

/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.localStorage`
 *
 * NOTE: Only **JSON-compatible** values are supported
 *
 * As a minimal example:
 *
 * ```javascript
 * import {local_storage} from "svelte-commons/lib/stores/browser";
 *
 * const store = local_storage("my_string_key", "some default string");
 *
 * store.subscribe((value) => {
 *     console.log(value);
 * }); // Will log any changes to the Store
 *
 * store.set("a non-default string"); // logs: `a non-default string`
 *
 * console.log(
 *     window.localStorage.getItem("svelte-commons.my_string_key")
 * ); // logs: `"a non-default string"`
 * ```
 */
export const local_storage = global.localStorage
    ? storage(global.localStorage, {
          event: "storage",
          event_source: global
      })
    : null;

/**
 * Returns a `storage` Svelte Store with a reactive binding to `window.sessionStorage`
 *
 * NOTE: Only **JSON-compatible** values are supported
 *
 * As a minimal example:
 *
 * ```javascript
 * import {session_storage} from "svelte-commons/lib/stores/browser";
 *
 * const store = session_storage("my_string_key", "some default string");
 *
 * store.subscribe((value) => {
 *     console.log(value);
 * }); // Will log any changes to the Store
 *
 * store.set("a non-default string"); // logs: `a non-default string`
 *
 * console.log(
 *     window.sessionStorage.getItem("svelte-commons.my_string_key")
 * ); // logs: `"a non-default string"`
 * ```
 */
export const session_storage = global.sessionStorage
    ? storage(global.sessionStorage, {
          event: "storage",
          event_source: global
      })
    : null;
