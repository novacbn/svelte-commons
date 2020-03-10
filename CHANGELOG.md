# CHANGELOG

## v0.0.3 - **UNRELEASED**

-   Added `format_css_declaration`, `format_css_reference`, `format_css_variable` to `util/shared/browser` for handling CSS standardized formatting
-   Added `map_classes`, `map_style`, `map_variables` to `util/shared/browser` for handling mapping HTML and CSS properties to objects
-   Added `format_dash_key` to `util/shared/string` for transforming text into dash key-like strings
    -   e.g. `format_dash_key("This is a KeyYep")` -> `this-is-a-key-yep`
-   Added `format_tokens` to `util/shared/string` for substituting `%s` tokens in a string, with the vararg spread
    -   e.g. `format_tokens("My name is %s! How are you, %s?", "Jeff", "Karen")` -> `My name is Jeff! How are you, Karen?`

## v0.0.2 - 2020/01/22

-   Updated `util/shared/stores` type exports with prefixes
-   Updated `util/shared/functional` type exports with new suffixes
-   Updated documentation
-   Moved `actions/action.ts` to `util/shared/actions.ts`
-   Moved `stores/store.ts` to `util/shared/stores.ts`
-   Removed old type export from `util/shared/functional`

## v0.0.1 - 2020/01/19

-   Initial Release
