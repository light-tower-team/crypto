import { ContentEncryptionAlgorithm } from "./types";

export const LENGTH_IN_BITS = {
  A128GCM: 128,
  A192GCM: 192,
  A256GCM: 256,
} as const satisfies Record<ContentEncryptionAlgorithm, number>;

/** in bites */
export const BYTE = 8;

/** in bytes */
export const INITIALIZATION_VECTOR_LENGTH = 12;

/** in bites */
export const AUTH_TAG_LENGTH = 128;
