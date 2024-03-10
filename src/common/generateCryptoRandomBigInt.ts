import { bufToBigInt } from "./utils/bufToBigInt";
import { generateCryptoRandomValues } from "./generateCryptoRandomValues";

export function generateCryptoRandomBigInt(bytes = 32): bigint {
  return bufToBigInt(generateCryptoRandomValues(bytes));
}
