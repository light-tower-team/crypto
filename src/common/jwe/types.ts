/** @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.3 */
export type RSA_AOEP_KeyEncryptionAlgorithm = "RSA-OAEP" | "RSA-OAEP-256";

/** @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.4 */
export type AES_KW_KeyEncryptionAlgorithm = "A128KW" | "A192KW" | "A256KW";

/** @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.5 */
export type DirectKeyEncryptionAlgorithm = "dir";

/** @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.7 */
export type AES_GCM_KeyEncryptionAlgorithm = "A128GCMKW" | "A192GCMKW" | "A256GCMKW";

/** @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8 */
export type PBES2_KeyEncryptionAlgorithm = "PBES2-HS256+A128KW" | "PBES2-HS384+A192KW" | "PBES2-HS512+A256KW";

export type KeyEncryptionAlgorithm =
  | RSA_AOEP_KeyEncryptionAlgorithm
  | AES_KW_KeyEncryptionAlgorithm
  | DirectKeyEncryptionAlgorithm
  | AES_GCM_KeyEncryptionAlgorithm
  | PBES2_KeyEncryptionAlgorithm;

/** @link https://www.rfc-editor.org/rfc/rfc7518.html#section-5.1 */
export type AES_GCM_ContentEncryptionAlgorithm = "A128GCM" | "A192GCM" | "A256GCM";

export type ContentEncryptionAlgorithm = AES_GCM_ContentEncryptionAlgorithm;

/** @link https://datatracker.ietf.org/doc/html/rfc7516#section-7 */
export type SerializationType = "compact" | "json";

/** @link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.2 */
export interface FlattenJsonWebEncryption {
  protected: string;
  encrypted_key?: string;
  iv: string;
  ciphertext: string;
  tag: string;
}

export type CryptoKeyLike = CryptoKey | ArrayBuffer;

export type PlaintextLink = string | ArrayBuffer;

export type JsonWebEncryptionLike = string | FlattenJsonWebEncryption;

export interface PBES2_Algorithm {
  hashingAlg: { name: "PBKDF2"; hash: "SHA-256" | "SHA-384" | "SHA-512" };
  wrappingAlg: { name: "AES-KW"; shortName: "A128KW" | "A192KW" | "A256KW"; length: 128 | 192 | 256 };
}

export interface AES_KW_Algorithm {
  name: "AES-KW";
  length: 128 | 192 | 256;
}

export interface AES_GCM_Algorithm {
  name: "AES-GCM";
  length: 128 | 192 | 256;
}

export interface AES_GCM_KW_Algorithm {
  name: "AES-GCM";
  length: 128 | 192 | 256;
}

export interface RSA_OAEP_Algorithm {
  name: "RSA-OAEP";
  hash: "SHA-256";
}

export interface PBES2_HeaderParams {
  /**
   * The "p2s" (PBES2 salt input) Header Parameter encodes a Salt Input
   * value, which is used as part of the PBKDF2 salt value.
   * @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8.1.1
   */
  p2s: string;
  /**
   * The "p2c" (PBES2 count) Header Parameter contains the PBKDF2
   * iteration count, represented as a positive JSON integer.
   * @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8.1.2
   */
  p2c: string;
}

export type HeaderParams = Partial<PBES2_HeaderParams>;
