import { digest } from "./digest";
import { HashFunctionArgs } from "./types";

export function sha256(...args: HashFunctionArgs): Promise<string> {
  return digest("SHA-256", ...args);
}
