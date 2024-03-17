import { bufToBigInt } from "./utils/buf_to_bigint";
import { generateCryptoRandomValues } from "./generate_crypto_random_values";

export function generateCryptoRandomBigInt(bytes = 32): bigint {
  return bufToBigInt(generateCryptoRandomValues(bytes));
}
