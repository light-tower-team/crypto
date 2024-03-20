import { generateCryptoRandomValues } from "./generate_crypto_random_values";
import { bufToBigInt } from "./utils/buf_to_bigint";

export function generateCryptoRandomBigInt(bytes = 32): bigint {
  return bufToBigInt(generateCryptoRandomValues(bytes));
}
