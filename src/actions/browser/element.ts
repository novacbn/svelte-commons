import {is_falsy} from "../../util/shared/functional";

import {IAction} from "../../util/shared/actions";

/**
 * Represents the attribute storage object
 */
export type IAttributeMap = {[key: string]: any};

let DEPRECATE_ATTRIBUTES = false;
let DEPRECATE_CLASSES = false;

/**
 * Returns an attribute passthrough Svelte Action
 *
 * As a minimal example:
 *
 * ```html
 * <script>
 *  import {attribute_passthrough} from "svelte-commons/lib/actions";
 *
 *  const attributes = attribute_passthrough();
 * </script>
 *
 * <!--
 *  By using `attribute_passthrough` as a `use:*` directive, and then supplying
 *  current properties of the Component (`$$props`). The end-developer using
 *  your Component will be able to pass common HTML5 attributes like `.id`
 *
 *  e.g. `<YourComponent id="some-id" />
 *
 *  However, by supplying your own `.style` property like below, it is blacklisted.
 *  Meaning the end-developer cannot override your own `.style` property.
 * -->
 * <div style="background-color:blue;" use:attributes={$$props}>
 *  ...some content...
 * </div>
 * ```
 *
 * However, you can initialize it with a whitelist of accepted-only properties too:
 *
 * ```html
 *  import {attribute_passthrough} from "svelte-commons/lib/actions";
 *
 *  // When providing a string array of keys, in this case `["style"]`. The end-developer
 *  // can only passthrough to those specific properties. `html5_passthrough` is initialized
 *  // this way with a long array of common HTML5 attributes
 *  const attributes = attribute_passthrough(["style"]);
 * </script>
 *
 * <div use:attributes={$$props}>
 *  ...some content...
 * </div>
 * ```
 *
 * @param whitelist
 */
export function attribute_passthrough(whitelist?: string[]): IAction {
    if (!DEPRECATE_ATTRIBUTES) {
        console.warn(
            "[svelte-commons] DEPRECATE: `attribute_passthrough` is deprecated, use prop spread"
        );
        DEPRECATE_ATTRIBUTES = true;
    }

    return (element: HTMLElement, properties: IAttributeMap) => {
        let update: (properties: IAttributeMap) => void;
        if (whitelist) {
            // If we have a whitelist, we just need to filter out all the
            // attributes that already exist before converting into lookup
            const _whitelist = whitelist.filter((value) => !element.hasAttribute(value));
            const lookup = new Set(_whitelist);

            update = (properties) => {
                for (const key in properties) {
                    if (!lookup.has(key)) continue;

                    // Any "falsy" values are treated as removals instead,
                    // e.g. `undefined`, `null`, `false`
                    const value = properties[key];
                    if (is_falsy(value)) element.removeAttribute(key);
                    else element.setAttribute(key, value);
                }
            };
        } else {
            // If we don't have a whitlist, we just need to convert the
            // current attributes into a blacklist lookup
            const lookup = new Set(element.getAttributeNames());

            update = (properties) => {
                for (const key in properties) {
                    if (lookup.has(key)) continue;

                    const value = properties[key];
                    if (is_falsy(value)) element.removeAttribute(key);
                    else element.setAttribute(key, value);
                }
            };
        }

        update(properties);

        return {update};
    };
}

/**
 * Represents a class name property passthrough Svelte Action
 *
 * As a minimal example:
 *
 * ```html
 * <script>
 *  import {class_passthrough} from "svelte-commons/lib/actions";
 *
 *  // Here, we're initializing a passthrough for `pull-right`
 *  // and `margin-right-small` classes as a Svelte Action
 *  const my_classes = class_passthrough([
 *      "pull-right",
 *      "margin-right-small"
 *  ]);
 * </script>
 *
 * <!--
 *  By using `my_classes` as a `use:*` directive, and then supplying
 *  current properties of the Component (`$$props`). The end-developer using
 *  your Component will be able to pass your class names as properties, like `.pull-right`
 *
 *  e.g. `<YourComponent pull-right />
 *
 *  Which will add the class to the `HTMLElement`. End-developers can also supply truthy
 *  values to dynamically toggle the class
 *
 *  e.g. `<YourComponent pull-right={some_value} />
 * -->
 * <div use:my_classes={$$props}>
 *  ...some content...
 * </div>
 * ```
 *
 * @param class_list
 */
export function class_passthrough(class_list: string[]): IAction {
    if (!DEPRECATE_CLASSES) {
        console.warn(
            "[svelte-commons] DEPRECATE: `class_passthrough` is deprecated, use `map_classes` instead"
        );
        DEPRECATE_CLASSES = true;
    }

    const lookup = new Set(class_list);

    return (element: HTMLElement, properties: IAttributeMap) => {
        const update = (properties: IAttributeMap) => {
            // NOTE: Instead of looping through the provided `class_list`, we need to loop
            // through the given properties. That way the order of class output is deterministic
            for (const key in properties) {
                if (!lookup.has(key)) continue;

                const value = properties[key];
                element.classList.toggle(key, !is_falsy(value));
            }
        };

        update(properties);

        return {update};
    };
}

/**
 * Represents a `attribute_passthrough` for common HTML5 attributes
 *
 * As a minimal example:
 *
 * ```html
 * <script>
 *  import {html5_passthrough} from "svelte-commons/lib/actions";
 * </script>
 *
 * <!--
 *  By using `html5_passthrough` as a `use:*` directive, and then supplying
 *  current properties of the Component (`$$props`). The end-developer using
 *  your Component will be able to pass common HTML5 attributes like `.id`
 *
 *  e.g. `<YourComponent id="some-id" />
 *
 *  However, by supplying your own `.style` property like below, it is blacklisted.
 *  Meaning the end-developer cannot override your own `.style` property.
 * -->
 * <div style="background-color:blue;" use:html5_passthrough={$$props}>
 *  ...some content...
 * </div>
 * ```
 */
export const html5_passthrough = attribute_passthrough([
    "alt",
    "class",
    "contenteditable",
    "disabled",
    "hidden",
    "href",
    "id",
    "open",
    "max",
    "maxlength",
    "min",
    "minlength",
    "multiple",
    "readonly",
    "rel",
    "required",
    "size",
    "src",
    "style",
    "title",
    "type",
    "value"
]);
