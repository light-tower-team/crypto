import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { base64ToBuf, base64ToText, bufToBase64, concatBuffs, textToBase64, textToBuf } from "../../utils";
import { aeskw } from "../aes_kw";
import { PBES2_ALGORITHMS } from "../constants";
import { CryptoKeyLike, PBES2_KeyEncryptionAlgorithm } from "../types";

async function deriveKey(alg: PBES2_KeyEncryptionAlgorithm, key: CryptoKeyLike, p2s: ArrayBuffer, p2c: number) {
  const { hashingAlg, wrappingAlg } = PBES2_ALGORITHMS[alg];

  const baseKey =
    key instanceof ArrayBuffer ? await crypto.subtle.importKey("raw", key, "PBKDF2", false, ["deriveKey"]) : key;

  /** @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8.1.1 */
  const salt = concatBuffs(textToBuf(alg), p2s);

  return crypto.subtle.deriveKey(
    {
      ...hashingAlg,
      salt,
      iterations: p2c,
    },
    baseKey,
    wrappingAlg,
    false,
    ["wrapKey", "unwrapKey"],
  );
}

export async function encrypt(alg: PBES2_KeyEncryptionAlgorithm, key: CryptoKeyLike, cek: ArrayBuffer) {
  const p2s = generateCryptoRandomValues(16);
  const p2c = 650_000;

  const derivedKey = await deriveKey(alg, key, p2s, p2c);

  const { wrappingAlg } = PBES2_ALGORITHMS[alg];

  const encryptedKey = await aeskw.wrap(wrappingAlg.shortName, cek, derivedKey);

  return { encryptedKey, p2c: textToBase64(p2c.toString()), p2s: bufToBase64(p2s) };
}
export async function decrypt(
  alg: PBES2_KeyEncryptionAlgorithm,
  key: CryptoKeyLike,
  encryptedKey: ArrayBuffer,
  p2s: string,
  p2c: string,
) {
  const salt = base64ToBuf(p2s);
  const interation = Number.parseInt(base64ToText(p2c), 10);

  const derivedKey = await deriveKey(alg, key, salt, interation);

  return aeskw.unwrap(encryptedKey, derivedKey);
}
