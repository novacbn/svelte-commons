# svelte-commons

## Description

Provides a collection of common Svelte Actions, Svelte Stores, and Utility Functions for working with Svelte / Browser

## Developer

### Installation

Open your terminal and install via `npm`:

```sh
npm install git+https://github.com/novacbn/svelte-commons#0.1.1
```

### Documentation

See TypeDoc documentation at [novacbn.github.io/svelte-commons](https://novacbn.github.io/svelte-commons).

### API

> **LEGEND**:
>
> -   `manual shared` means the API requires some manual handling, to work in both contexts

-   Stores
    -   [`collection`](https://novacbn.github.io/svelte-commons/interfaces/_stores_shared_collection_.icollectionstore.html) — **shared**
    -   [`hash`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_location_.html#hash) — **browser only**
    -   [`immutable`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_immutable_.html#immutable) — **shared**
    -   [`local_storage`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_storage_.html#local_storage) — **browser only**
    -   [`merged`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_merged_.html#merged) — **shared**
    -   [`overlay`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_overlay_.html#overlay) — **shared**
    -   [`pathname`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_location_.html#pathname) — **browser only**
    -   [`query_param`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_query_param_#query_param) — **browser only**
    -   [`router`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_router_#router) — **manual shared**
    -   [`schema`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_schema_.html#schema) — **shared**
    -   [`search`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_location_#search) — **browser only**
    -   [`session_storage`](https://novacbn.github.io/svelte-commons/modules/_stores_browser_storage_.html#session_storage) — **browser only**
    -   [`storage`](https://novacbn.github.io/svelte-commons/modules/_stores_shared_storage_#storage) — **shared**
-   Utilities
    -   [`format_css_declaration`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#format_css_declaration) — **shared**
    -   [`format_css_reference`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#format_css_reference) — **shared**
    -   [`format_css_variable`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#format_css_variable) — **shared**
    -   [`format_dash_key`](https://novacbn.github.io/svelte-commons/modules/_util_shared_string_.html#format_dash_key) — **shared**
    -   [`format_tokens`](https://novacbn.github.io/svelte-commons/modules/_util_shared_string_.html#format_tokens) — **shared**
    -   [`format_url`](https://novacbn.github.io/svelte-commons/modules/_util_shared_url_#format_url) — **shared**
    -   [`goto`](https://novacbn.github.io/svelte-commons/modules/_util_browser_location_#goto) - **browser only**
    -   [`is_internal_href`](https://novacbn.github.io/svelte-commons/modules/_util_shared_url_#is_internal_href) — **shared**
    -   [`is_readable`](https://novacbn.github.io/svelte-commons/modules/_util_shared_stores_.html#is_readable) — **shared**
    -   [`is_writable`](https://novacbn.github.io/svelte-commons/modules/_util_shared_stores_.html#is_writable) — **shared**
    -   [`join`](https://novacbn.github.io/svelte-commons/modules/_util_shared_url_#join) — **shared**
    -   [`make_memory_storage`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#make_memory_storage) — **shared**
    -   [`map_classes`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#map_classes) — **shared**
    -   [`map_style`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#map_style) — **shared**
    -   [`map_variables`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_.html#map_variables) — **shared**
    -   [`normalize_pathname`](https://novacbn.github.io/svelte-commons/modules/_util_shared_url_#normalize_pathname) — **shared**
    -   [`parse_query`](https://novacbn.github.io/svelte-commons/modules/_util_shared_url_#parse_query) — **shared**
-   Constants
    -   [`IS_BROWSER`](https://novacbn.github.io/svelte-commons/modules/_util_shared_browser_#is_browser) — **shared**
