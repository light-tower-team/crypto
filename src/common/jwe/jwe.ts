import { base64ToBuf, base64ToText, bufToBase64, textToBase64, textToBuf } from "../utils";
import { decrypt } from "./decrypt_content_management/decrypt_content_management";
import { decryptKeyManagement } from "./decrypt_key_management/decrypt_key_management";
import { encrypt } from "./encrypt_content_management/encrypt_content_management";
import { encryptKeyManagement } from "./encrypt_key_management/encrypt_key_management";
import {
  ContentEncryptionAlgorithmNotSpecifiedError,
  KeyEncryptionAlgorithmNotSpecifiedError,
  UnknownSerializationError,
} from "./errors";
import {
  ContentEncryptionAlgorithm,
  CryptoKeyLike,
  FlattenJsonWebEncryption,
  JsonWebEncryptionLike,
  KeyEncryptionAlgorithm,
  PlaintextLink,
  SerializationType,
} from "./types";

export class JsonWebEncryption {
  #alg: KeyEncryptionAlgorithm | null = null;
  #enc: ContentEncryptionAlgorithm | null = null;

  public setKeyEncryptionAlgorithm(alg: KeyEncryptionAlgorithm): this {
    this.#alg = alg;
    return this;
  }

  public setContentEncryptionAlgorithm(enc: ContentEncryptionAlgorithm): this {
    this.#enc = enc;
    return this;
  }

  public async encrypt(
    key: CryptoKeyLike,
    plaintext: PlaintextLink,
    serialization: SerializationType,
  ): Promise<JsonWebEncryptionLike>;
  public async encrypt(key: CryptoKeyLike, plaintext: PlaintextLink): Promise<string>;
  public async encrypt(key: CryptoKeyLike, plaintext: PlaintextLink, serialization: "compact"): Promise<string>;
  public async encrypt(key: CryptoKeyLike, plaintext: PlaintextLink, serialization: "compact"): Promise<string>;
  public async encrypt(
    key: CryptoKeyLike,
    plaintext: PlaintextLink,
    serialization: SerializationType = "compact",
  ): Promise<JsonWebEncryptionLike> {
    if (!this.#alg) {
      throw new KeyEncryptionAlgorithmNotSpecifiedError();
    }

    if (!this.#enc) {
      throw new ContentEncryptionAlgorithmNotSpecifiedError();
    }

    const { cek, encryptedKey, params } = await encryptKeyManagement(this.#alg, this.#enc, key);

    const { ciphertext, tag, iv } = await encrypt(
      this.#enc,
      cek,
      typeof plaintext === "string" ? textToBuf(plaintext) : plaintext,
    );

    const header = { alg: this.#alg, enc: this.#enc, ...params };

    const flatten: FlattenJsonWebEncryption = {
      ciphertext: bufToBase64(ciphertext),
      protected: textToBase64(JSON.stringify(header)),
      iv: bufToBase64(iv),
      tag: bufToBase64(tag),
    };

    if (encryptedKey) {
      flatten.encrypted_key = bufToBase64(encryptedKey);
    }

    switch (serialization) {
      case "json": {
        return flatten;
      }
      case "compact": {
        return [flatten.protected, flatten.encrypted_key, flatten.iv, flatten.ciphertext, flatten.tag].join(".");
      }
      default: {
        throw new UnknownSerializationError();
      }
    }
  }

  public static async decrypt(jwe: JsonWebEncryptionLike, key: CryptoKeyLike): Promise<string> {
    let flatten: FlattenJsonWebEncryption;

    if (typeof jwe === "string") {
      const a = jwe.split(".");

      flatten = {
        protected: a[0],
        encrypted_key: a[1],
        iv: a[2],
        ciphertext: a[3],
        tag: a[4],
      };
    } else {
      flatten = jwe;
    }

    const { alg, enc, ...params } = JSON.parse(base64ToText(flatten.protected));

    const cek = await decryptKeyManagement(
      alg,
      key,
      flatten.encrypted_key ? base64ToBuf(flatten.encrypted_key) : undefined,
      params,
    );

    return decrypt(enc, cek, base64ToBuf(flatten.ciphertext), base64ToBuf(flatten.tag), base64ToBuf(flatten.iv));
  }
}
