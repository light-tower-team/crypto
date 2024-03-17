import { generateCryptoRandomValues } from "../generate_crypto_random_values";
import { ContentEncryptionAlgorithm } from "./types";

export function generateIV(enc: ContentEncryptionAlgorithm): ArrayBuffer {
  let byteLength = 0;

  switch (enc) {
    case "A128GCM":
    case "A192GCM":
    case "A256GCM": {
      byteLength = 96;
      break;
    }
  }

  return generateCryptoRandomValues(byteLength);
}
