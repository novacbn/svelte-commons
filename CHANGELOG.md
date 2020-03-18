# CHANGELOG

## v0.1.0 - 2020/03/18

-   **BREAKING CHANGES**
    -   Moved `query_param` from `stores/browser/location` to `stores/browser/query_param`
    -   Moved `router` from `stores/browser/location` to `stores/shared/router`
    -   Moved `storage` from `stores/browser/storage` to `stores/shared/storage`
    -   Updated `hash` / `pathname`
        -   Both are now **Browser-only**, due to `router` no longer needing them on Server context
        -   Both now **default to creating new History states** for Store changes
        -   To revert back to old History behaviour, pass `ILocationOptions.replace`, e.g. `const store = hash({replace: true});`
        -   They can be made read-only via `ILocationOptions.readonly`, e.g. `const store = hash({readonly: true});`
    -   Updated `query_param` to now require default values, used to determine typing
    -   Updated `storage` to not automagically return `Readable` Stores on Server
        -   Replacements: Utilize `make_memory_storage` and `storage` to create a graceful degradation Store, or, default to a `readable` if `local_storage` not found, etc...
        -   Example #1:
            -   `const graceful_storage = local_storage || session_storage || storage(make_memory_storage());`
            -   `const color = graceful_storage("preferences.color", "red");`
        -   Example #2:
            -   `const color = local_storage ? local_storage("preferences.color", "red") : readable("red");`
    -   Updated `local_storage` / `session_storage` to be `null` if their respective Web Storages are not available
    -   Updated `router` to return `{component, href, goto, url, page: {host, path, params, query}}`, `page` with [Sapper's `page`](https://sapper.svelte.dev/docs/#Argument)
        -   `IRouterReturn.goto` in this case is the same as normal `goto`, but has its `IGotoOptions.base_url` and `IGotoOptions.hash` bound to `IRouterOptions`
    -   Removed deprecated `attribute_passthrough` / `class_passthrough` / `html5_passthrough` from `actions/browser/element`
    -   Removed deprecated `immutable_readable` / `immutable_writable` from `stores/shared/immutable`
    -   Removed the old `util/shared/context` APIs to reflect new `router` changes
-   Added `search` to `stores/browser/location`
-   Added `goto` to `util/browser/location`
-   Added `IS_BROWSER` to `util/shared/browser`
-   Updated `format_url`, `is_internal_href`, `join`, `normalize_pathname` in `util/shared/url` to be public API
-   Updated `storage` to utilize `overlay`

## v0.0.4 - 2020/03/11

-   Added to `overlay` to `stores/shared/overlay` for similar functionality as `derived`, but providing a second callback to handle `Writable` Svelte Stores
-   Added `make_memory_storage` to `util/shared/browser`, which makes an in-memory version of [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage) for use with `storage`
-   Updated `is_readable` / `is_writable` to work as TypeScript Type Guards
-   Updated `immutable`, `schema` to utilize `derived` and `overlay`
-   Updated `tsconfig.json` to fix TypeScript Compiler output not working via CommonJS `require`
-   Intent to deprecate `immutable_readable` / `immutable_writable`, use `immutable` instead
    -   The two functions were separate at the time, **ONLY** due to the `overlay` function not existing
    -   Both `immutable_readable` / `immutable_writable` are now aliases of `immutable`
    -   **IMPORTANT NOTE**: `immutable` defaults to a `Writable` Store if you pass in a non-Store value, unlike `immutable_readable` which defaults to `Readable`

## v0.0.3 - 2020/03/10

-   Added [`geraintluff/tv4`](https://github.com/geraintluff/tv4) as a dependency for JSON Schema validation
-   Added `format_css_declaration`, `format_css_reference`, `format_css_variable` to `util/shared/browser` for handling CSS standardized formatting
-   Added `map_classes`, `map_style`, `map_variables` to `util/shared/browser` for handling mapping HTML and CSS properties to objects
-   Added `format_dash_key` to `util/shared/string` for transforming text into dash key-like strings
    -   e.g. `format_dash_key("This is a KeyYep")` -> `this-is-a-key-yep`
-   Added `format_tokens` to `util/shared/string` for substituting `%s` tokens in a string, with the vararg spread
    -   e.g. `format_tokens("My name is %s! How are you, %s?", "Jeff", "Karen")` -> `My name is Jeff! How are you, Karen?`
-   Added `merged` to `stores/shared/merged` for applying partials changes to an object over time
-   Added `schema` to `stores/shared/schema` for continuous JSON Schema validation for Svelte Store I/O
-   Intent to deprecate `attribute_passthrough`, `class_passthrough`, and `html5_passthrough` from `actions/browser/element`
    -   Due to SSR not being possible with them, not being considered before
    -   Use prop spreading to replace `attribute_passthrough`
    -   Use `map_classes` from `util/shared/browser` to replace `class_passthrough`
-   Moved `IJSONType` from `stores/browser/storage` to `util/shared/builtin`
-   Updated `storage` to override `Writable.set` / `Writable.update` instead of handling `Writable.subscribe`
-   Fixed bug in `storage`, where if you set `undefined`, it would not update Store to reflect default value

## v0.0.2 - 2020/01/22

-   Updated `util/shared/stores` type exports with prefixes
-   Updated `util/shared/functional` type exports with new suffixes
-   Updated documentation
-   Moved `actions/action.ts` to `util/shared/actions.ts`
-   Moved `stores/store.ts` to `util/shared/stores.ts`
-   Removed old type export from `util/shared/functional`

## v0.0.1 - 2020/01/19

-   Initial Release
