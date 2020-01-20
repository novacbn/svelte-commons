"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functional_1 = require("../../util/shared/functional");
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
function attribute_passthrough(whitelist) {
    return function (element, properties) {
        var update;
        if (whitelist) {
            // If we have a whitelist, we just need to filter out all the
            // attributes that already exist before converting into lookup
            var _whitelist = whitelist.filter(function (value) { return !element.hasAttribute(value); });
            var lookup_1 = new Set(_whitelist);
            update = function (properties) {
                for (var key in properties) {
                    if (!lookup_1.has(key))
                        continue;
                    // Any "falsy" values are treated as removals instead,
                    // e.g. `undefined`, `null`, `false`
                    var value = properties[key];
                    if (functional_1.is_falsy(value))
                        element.removeAttribute(key);
                    else
                        element.setAttribute(key, value);
                }
            };
        }
        else {
            // If we don't have a whitlist, we just need to convert the
            // current attributes into a blacklist lookup
            var lookup_2 = new Set(element.getAttributeNames());
            update = function (properties) {
                for (var key in properties) {
                    if (lookup_2.has(key))
                        continue;
                    var value = properties[key];
                    if (functional_1.is_falsy(value))
                        element.removeAttribute(key);
                    else
                        element.setAttribute(key, value);
                }
            };
        }
        update(properties);
        return { update: update };
    };
}
exports.attribute_passthrough = attribute_passthrough;
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
function class_passthrough(class_list) {
    var lookup = new Set(class_list);
    return function (element, properties) {
        var update = function (properties) {
            // NOTE: Instead of looping through the provided `class_list`, we need to loop
            // through the given properties. That way the order of class output is deterministic
            for (var key in properties) {
                if (!lookup.has(key))
                    continue;
                var value = properties[key];
                element.classList.toggle(key, !functional_1.is_falsy(value));
            }
        };
        update(properties);
        return { update: update };
    };
}
exports.class_passthrough = class_passthrough;
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
exports.html5_passthrough = attribute_passthrough([
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
//# sourceMappingURL=element.js.map