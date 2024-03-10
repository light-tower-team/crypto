import { HashFunctionArgs } from "./types";
import { digest } from "./digest";

export function sha256(...args: HashFunctionArgs): Promise<string> {
  return digest("SHA-256", ...args);
}
