import { AESEncryptionAlgorithm } from "../jwe";
import { AESAlgorithm } from "./types";

export const AES_ALGORITHMS = {
  A128GCM: { name: "AES-GCM", length: 128 },
  A192GCM: { name: "AES-GCM", length: 192 },
  A256GCM: { name: "AES-GCM", length: 256 },
} as const satisfies Record<AESEncryptionAlgorithm, AESAlgorithm>;

/** in bytes */
export const INITIALIZATION_VECTOR_LENGTH = 12;

/** in bites */
export const AUTH_TAG_LENGTH = 128;
