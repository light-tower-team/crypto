export type JSONPrimitive = string | number | boolean;

export type JSONArray = Array<JSONValue>;

export type JSONObject = { [key: string | number]: JSONValue } | null;

export type JSONValue = JSONPrimitive | JSONArray | JSONObject;
