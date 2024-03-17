import { aesgcm } from "./aes_gcm";
import { ContentEncryptionAlgorithm, CryptoKeyLike } from "./types";

export function decrypt(
  enc: ContentEncryptionAlgorithm,
  cek: CryptoKeyLike,
  ciphertext: ArrayBuffer,
  tag: ArrayBuffer,
  iv: ArrayBuffer,
): Promise<string> {
  switch (enc) {
    case "A128GCM":
    case "A192GCM":
    case "A256GCM": {
      return aesgcm.decrypt(cek, ciphertext, tag, iv);
    }
    default: {
      throw new Error("Unknown content encryption algorithm");
    }
  }
}
