import { IAction } from "../action";
/**
 * Represents the attribute storage object
 */
export declare type IAttributeMap = {
    [key: string]: any;
};
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
export declare function attribute_passthrough(whitelist?: string[]): IAction;
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
export declare function class_passthrough(class_list: string[]): IAction;
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
export declare const html5_passthrough: IAction;
