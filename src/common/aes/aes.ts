import { concatBuffs, textToBuf, bufToBase64, base64ToBuf, bufToText } from "../utils";
import { generateCryptoRandomValues } from "../generateCryptoRandomValues";
import { AESEncryption } from "../jwe";
import { ContentEncryptionAlgorithm } from "./types";
import { BYTE, AUTH_TAG_LENGTH, INITIALIZATION_VECTOR_LENGTH, LENGTH_IN_BITS } from "./constants";
import { IncorrectOriginCryptoKeyError } from "../errors";

export class AES {
  private constructor(public readonly origin: CryptoKey) {
    if (!this.origin.algorithm.name.startsWith("AES") || this.origin.type !== "secret") {
      throw new IncorrectOriginCryptoKeyError();
    }
  }

  public static async generateKey(enc: ContentEncryptionAlgorithm = "A256GCM"): Promise<AES> {
    const key = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: LENGTH_IN_BITS[enc],
      },
      true,
      ["wrapKey", "unwrapKey", "encrypt", "decrypt"],
    );

    return new AES(key);
  }

  public async encrypt(plaintext: string): Promise<AESEncryption> {
    const iv = generateCryptoRandomValues(INITIALIZATION_VECTOR_LENGTH);
    const tagLength = AUTH_TAG_LENGTH;

    const ciphertextAndAuthTag = await crypto.subtle.encrypt(
      { ...this.origin.algorithm, iv, tagLength },
      this.origin,
      textToBuf(plaintext),
    );

    const divider = ciphertextAndAuthTag.byteLength - tagLength / BYTE;

    const ciphertext = ciphertextAndAuthTag.slice(0, divider);
    const authTag = ciphertextAndAuthTag.slice(divider);

    return {
      kid: "",
      enc: "A256GCM",
      cty: "jwk+json",
      iv: bufToBase64(iv),
      tag: bufToBase64(authTag),
      ciphertext: bufToBase64(ciphertext),
    };
  }

  public async decrypt(jwe: AESEncryption): Promise<string> {
    const iv = base64ToBuf(jwe.iv);
    const tag = base64ToBuf(jwe.tag);
    const tagLength = tag.byteLength * BYTE;
    const ciphertext = base64ToBuf(jwe.ciphertext);

    const plaintext = bufToText(
      await crypto.subtle.decrypt(
        { ...this.origin.algorithm, iv, tagLength },
        this.origin,
        concatBuffs(ciphertext, tag),
      ),
    );

    return plaintext;
  }
}
