import { HashFunctionArgs } from "./types";
import { digest } from "./digest";

export function sha384(...args: HashFunctionArgs): Promise<string> {
  return digest("SHA-384", ...args);
}
