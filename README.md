# svelte-commons

## Description

Provides a collection of common Svelte Actions, Svelte Stores, and Utility Functions for working with Svelte / Browser

## Developer

### Installation

Open your terminal and install via `npm`:

```sh
npm install git+https://github.com/novacbn/svelte-commons#0.0.4
```

### Documentation

See TypeDoc documentation at [novacbn.github.io/svelte-commons](https://novacbn.github.io/svelte-commons).

### API

> **LEGEND**:
>
> -   `manual shared` means the API requires some manual handling, to work in both states
> -   `pseudo shared` means the API works in both states, but with caveats

-   Actions
    -   [`attribute_passthrough`](https://novacbn.github.io/svelte-commons/modules/_actions_browser_element_.html#attribute_passthrough) — **browser only**
    -   [`class_passthrough`](https://novacbn.github.io/svelte-commons/modules/_actions_browser_element_.html#class_passthrough) — **browser only**
    -   [`html5_passthrough`](https://novacbn.github.io/svelte-commons/modules/_actions_browser_element_.html#html5_passthrough) — **browser only**
-   Stores
    -   [`collection`](https://novacbn.github.io/svelte-commons/interfaces/_stores_shared_collection_.icollectionstore.html) — **shared**
    -   [`hash`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_location_.html#hash) — **manual shared**
    -   [`immutable`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_immutable_.html#immutable) — **shared**
    -   [`local_storage`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_storage_.html#local_storage) — **pseudo shared**
    -   [`merged`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_merged_.html#merged) — **shared**
    -   [`overlay`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_overlay_.html#overlay) — **shared**
    -   [`pathname`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_location_.html#pathname) — **manual shared**
    -   [`query_param`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_location_.html#query_param) — **manual shared**
    -   [`router`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_location_.html#router) — **manual shared**
    -   [`session_storage`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_storage_.html#session_storage) — **pseudo shared**
    -   [`schema`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_schema_.html#schema) — **shared**
    -   [`storage`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_storage_.html#storage) — **pseudo shared**
-   Utilities
    -   [`format_css_declaration`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#format_css_declaration) — **shared**
    -   [`format_css_reference`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#format_css_reference) — **shared**
    -   [`format_css_variable`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#format_css_variable) — **shared**
    -   [`format_dash_key`](https://novacbn.github.io/svelte-commons/modules/_util_shared_string_.html#format_dash_key) — **shared**
    -   [`format_tokens`](https://novacbn.github.io/svelte-commons/modules/_util_shared_string_.html#format_tokens) — **shared**
    -   [`is_readable`](https://novacbn.github.io/svelte-commons/modules/_util_shared_stores_.html#is_readable) — **shared**
    -   [`is_writable`](https://novacbn.github.io/svelte-commons/modules/_util_shared_stores_.html#is_writable) — **shared**
    -   [`make_memory_storage`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#make_memory_storage) — **shared**
    -   [`map_classes`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#map_classes) — **shared**
    -   [`map_style`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#map_style) — **shared**
    -   [`map_variables`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#map_variables) — **shared**
