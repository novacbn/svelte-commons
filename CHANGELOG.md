# CHANGELOG

## v0.0.4 - **UNRELEASED**

-   Added to `overlay` to `stores/shared/overlay` for similar functionality as `derived`, but providing a second callback to handle `Writable` Svelte Stores
-   Updated `is_readable` / `is_writable` to work as TypeScript Type Guards
-   Updated `schema` to utilize `derived` and `overlay`
-   Updated `tsconfig.json` to fix TypeScript Compiler output not working via CommonJS `require`

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
