import { AES_KW_ALGORITHMS } from "../constants";
import { AES_KW_KeyEncryptionAlgorithm } from "../types";

const BOGUS_ALGORITHM: [HmacImportParams, boolean, KeyUsage[]] = [{ hash: "SHA-256", name: "HMAC" }, true, ["sign"]];

export async function wrap(
  alg: AES_KW_KeyEncryptionAlgorithm,
  cek: ArrayBuffer,
  wrappingKey: CryptoKey,
): Promise<ArrayBuffer> {
  const wrappingAlg = AES_KW_ALGORITHMS[alg];

  // we're importing the cek to end up with CryptoKey instance that can be wrapped,
  // the algorithm used is irrelevant
  const key = await crypto.subtle.importKey("raw", cek, ...BOGUS_ALGORITHM);

  return crypto.subtle.wrapKey("raw", key, wrappingKey, wrappingAlg);
}

export async function unwrap(wrappedKey: ArrayBuffer, unwrappingKey: CryptoKey): Promise<ArrayBuffer> {
  const key = await crypto.subtle.unwrapKey("raw", wrappedKey, unwrappingKey, "AES-KW", ...BOGUS_ALGORITHM);

  return crypto.subtle.exportKey("raw", key);
}
