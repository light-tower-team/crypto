import { AES_GCM_ALGORITHMS } from "./constants";
import { AES_GCM_Algorithm, ContentEncryptionAlgorithm } from "./types";

export async function generateCEK(enc: ContentEncryptionAlgorithm): Promise<ArrayBuffer> {
  const algorithm: AES_GCM_Algorithm | undefined = AES_GCM_ALGORITHMS[enc];

  if (!algorithm) {
    throw new Error("Unknown content encryption algorithm.");
  }

  return crypto.subtle.exportKey("raw", await crypto.subtle.generateKey(algorithm, true, ["encrypt", "decrypt"]));
}
