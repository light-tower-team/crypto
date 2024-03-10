import { bufToHex } from "./utils/bufToHex";
import { generateCryptoRandomValues } from "./generateCryptoRandomValues";

export function generateCryptoRandomString(bytes = 32): string {
  return bufToHex(generateCryptoRandomValues(bytes));
}
