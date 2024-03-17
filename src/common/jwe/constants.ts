import {
  PBES2_KeyEncryptionAlgorithm,
  AES_GCM_KeyEncryptionAlgorithm,
  AES_KW_KeyEncryptionAlgorithm,
  RSA_AOEP_KeyEncryptionAlgorithm,
  AES_GCM_ContentEncryptionAlgorithm,
  RSA_OAEP_Algorithm,
  AES_KW_Algorithm,
  AES_GCM_KW_Algorithm,
  AES_GCM_Algorithm,
  PBES2_Algorithm,
} from "./types";

export const RSA_OAEP_ALGORITHMS = {
  "RSA-OAEP": { name: "RSA-OAEP", hash: "SHA-256" },
  "RSA-OAEP-256": { name: "RSA-OAEP", hash: "SHA-256" },
} as const satisfies Record<RSA_AOEP_KeyEncryptionAlgorithm, RSA_OAEP_Algorithm>;

export const AES_KW_ALGORITHMS = {
  A128KW: { name: "AES-KW", length: 128 },
  A192KW: { name: "AES-KW", length: 192 },
  A256KW: { name: "AES-KW", length: 256 },
} as const satisfies Record<AES_KW_KeyEncryptionAlgorithm, AES_KW_Algorithm>;

export const AES_GCM_KW_ALGORITHMS = {
  A128GCMKW: { name: "AES-GCM", length: 128 },
  A192GCMKW: { name: "AES-GCM", length: 192 },
  A256GCMKW: { name: "AES-GCM", length: 256 },
} as const satisfies Record<AES_GCM_KeyEncryptionAlgorithm, AES_GCM_KW_Algorithm>;

export const AES_GCM_ALGORITHMS = {
  A128GCM: { name: "AES-GCM", length: 128 },
  A192GCM: { name: "AES-GCM", length: 192 },
  A256GCM: { name: "AES-GCM", length: 256 },
} as const satisfies Record<AES_GCM_ContentEncryptionAlgorithm, AES_GCM_Algorithm>;

export const PBES2_ALGORITHMS = {
  "PBES2-HS256+A128KW": {
    hashingAlg: { name: "PBKDF2", hash: "SHA-256" },
    wrappingAlg: { ...AES_KW_ALGORITHMS["A128KW"], shortName: "A128KW" },
  },
  "PBES2-HS384+A192KW": {
    hashingAlg: { name: "PBKDF2", hash: "SHA-384" },
    wrappingAlg: { ...AES_KW_ALGORITHMS["A192KW"], shortName: "A192KW" },
  },
  "PBES2-HS512+A256KW": {
    hashingAlg: { name: "PBKDF2", hash: "SHA-512" },
    wrappingAlg: { ...AES_KW_ALGORITHMS["A256KW"], shortName: "A256KW" },
  },
} as const satisfies Record<PBES2_KeyEncryptionAlgorithm, PBES2_Algorithm>;
