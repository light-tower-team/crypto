import { HashFunctionArgs } from "./types";
import { digest } from "./digest";

export function sha512(...args: HashFunctionArgs): Promise<string> {
  return digest("SHA-512", ...args);
}
