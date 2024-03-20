import { digest } from "./digest";
import { HashFunctionArgs } from "./types";

export function sha512(...args: HashFunctionArgs): Promise<string> {
  return digest("SHA-512", ...args);
}
