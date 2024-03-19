import { aesgcm } from "../aes_gcm";
import { UnknownContentEncryptionAlgorithmError } from "../errors";
import { ContentEncryptionAlgorithm, CryptoKeyLike } from "../types";

export function encrypt(
  enc: ContentEncryptionAlgorithm,
  cek: CryptoKeyLike,
  plaintext: ArrayBuffer,
): Promise<{ ciphertext: ArrayBuffer; tag: ArrayBuffer; iv: ArrayBuffer }> {
  switch (enc) {
    case "A128GCM":
    case "A192GCM":
    case "A256GCM": {
      return aesgcm.encrypt(cek, plaintext);
    }
    default: {
      throw new UnknownContentEncryptionAlgorithmError();
    }
  }
}
