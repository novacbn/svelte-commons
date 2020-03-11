/**
 * Represents values that can be serialize / deserialized via `JSON.stringify` / `JSON.parse`
 */
export type IJSONType = boolean | number | string | IJSONType[] | {[key: string]: IJSONType};
