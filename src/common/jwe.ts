/**
 * A data structure representing an encrypted and integrity-protected message.
 * @link https://datatracker.ietf.org/doc/html/rfc7516#section-2
 */
export type JsonWebEncryption = AESEncryption | RSAEncryption | PBES2Encryption;

export interface BaseJsonWebEncryption {
  /**
   * The "cty" (content type) Header Parameter is used by JWS applications
   * to declare the media type of the secured content (the payload).
   * @link https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.10
   */
  cty: "jwk+json";
  /**
   * The "kid" (key ID) Header Parameter is a hint indicating which key was used to secure the JWS.
   * @link https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.4
   */
  kid?: string;
  /**
   * The ciphertext
   */
  ciphertext: string;
}

export type AESEncryptionAlgorithm = "A128GCM" | "A192GCM" | "A256GCM";

export interface AESEncryption extends BaseJsonWebEncryption {
  /**
   * The "enc" (encryption algorithm) Header Parameter identifies the content encryption algorithm
   * used to perform authenticated encryption on the plaintext to produce the ciphertext and the Authentication Tag.
   * @link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.2
   */
  enc: AESEncryptionAlgorithm;
  /**
   * The "iv" (initialization vector) Header Parameter value is the base64url-encoded representation
   * of the 96-bit IV value used for the key encryption operation.
   * @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.7.1.1
   */
  iv: string;
  /**
   * The "tag" (authentication tag) Header Parameter value is the base64url-encoded representation of the 128-bit
   * Authentication Tag value resulting from the key encryption operation.
   * @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.7.1.2
   */
  tag: string;
}

export interface RSAEncryption extends BaseJsonWebEncryption {
  /**
   * The "alg" (algorithm) Header Parameter identifies the cryptographic algorithm used to secure the JWS.
   * @link https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.1
   */
  alg: "RSA-OAEP-256";
}

export type PBES2EncryptionAlgorithm = "PBES2-HS256+A128KW" | "PBES2-HS384+A192KW" | "PBES2-HS512+A256KW";

/**
 * Key Encryption with PBES2
 * @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8
 */
export interface PBES2Encryption extends AESEncryption {
  /**
   * The "alg" (algorithm) Header Parameter identifies the cryptographic algorithm used to secure the JWS.
   * @link https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.1
   */
  alg: PBES2EncryptionAlgorithm;
  /**
   * The "p2s" (PBES2 salt input) Header Parameter encodes a Salt Input value, which is used as part of the PBKDF2 salt value.
   * The "p2s" value is BASE64URL(Salt Input).
   * @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8.1.1
   */
  p2s: string;
  /**
   * The "p2c" (PBES2 count) Header Parameter contains the PBKDF2 iteration count, represented as a positive JSON integer.
   * @link https://www.rfc-editor.org/rfc/rfc7518.html#section-4.8.1.2
   */
  p2c: string;
}
