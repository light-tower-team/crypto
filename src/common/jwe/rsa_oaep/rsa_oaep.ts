import { CryptoKeyLike } from "../types";
import { CryptoKeyRequiredError } from "./errors";

export async function encrypt(key: CryptoKeyLike, cek: ArrayBuffer): Promise<ArrayBuffer> {
  if (!(key instanceof CryptoKey)) {
    throw new CryptoKeyRequiredError();
  }

  return crypto.subtle.encrypt(key.algorithm, key, cek);
}

export async function decrypt(key: CryptoKeyLike, encryptedKey: ArrayBuffer): Promise<ArrayBuffer> {
  if (!(key instanceof CryptoKey)) {
    throw new CryptoKeyRequiredError();
  }

  return crypto.subtle.decrypt(key.algorithm, key, encryptedKey);
}
