import { CryptoKeyLike } from "../types";

export async function encrypt(key: CryptoKeyLike, cek: ArrayBuffer): Promise<ArrayBuffer> {
  if (!(key instanceof CryptoKey)) {
    throw new Error("The key must be a crypto key.");
  }

  return crypto.subtle.encrypt(key.algorithm, key, cek);
}

export async function decrypt(key: CryptoKeyLike, encryptedKey: ArrayBuffer): Promise<ArrayBuffer> {
  if (!(key instanceof CryptoKey)) {
    throw new Error("The key must be a crypto key.");
  }

  return crypto.subtle.decrypt(key.algorithm, key, encryptedKey);
}
