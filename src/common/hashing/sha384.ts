import { digest } from "./digest";
import { HashFunctionArgs } from "./types";

export function sha384(...args: HashFunctionArgs): Promise<string> {
  return digest("SHA-384", ...args);
}
