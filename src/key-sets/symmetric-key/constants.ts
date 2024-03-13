import { PBES2EncryptionAlgorithm } from "../../common";
import { PBES2Algorithm } from "./types";

export const PBES2_ALGORITHMS = {
  "PBES2-HS256+A128KW": { baseAlg: { name: "PBKDF2", hash: "SHA-256" }, wrappingAlg: { name: "AES-KW", length: 128 } },
  "PBES2-HS384+A192KW": { baseAlg: { name: "PBKDF2", hash: "SHA-384" }, wrappingAlg: { name: "AES-KW", length: 192 } },
  "PBES2-HS512+A256KW": { baseAlg: { name: "PBKDF2", hash: "SHA-512" }, wrappingAlg: { name: "AES-KW", length: 256 } },
} as const satisfies Record<PBES2EncryptionAlgorithm, PBES2Algorithm>;

export const CURRENT_PBES2_ALGORITHM: PBES2EncryptionAlgorithm = "PBES2-HS256+A128KW";

export const INTERATION_COUNT = 650_000;

/** in bytes */
export const INITIALIZATION_VECTOR_LENGTH = 12;

/** in bites */
export const AUTH_TAG_LENGTH = 128;
