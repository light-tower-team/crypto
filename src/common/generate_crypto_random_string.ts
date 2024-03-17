import { bufToHex } from "./utils/buf_to_hex";
import { generateCryptoRandomValues } from "./generate_crypto_random_values";

export function generateCryptoRandomString(bytes = 32): string {
  return bufToHex(generateCryptoRandomValues(bytes));
}
