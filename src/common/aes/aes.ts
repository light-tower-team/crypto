import { concatBuffs, textToBuf, bufToBase64, base64ToBuf, bufToText } from "../utils";
import { generateCryptoRandomValues } from "../generateCryptoRandomValues";
import { AESEncryption } from "../jwe";

export type ContentEncryptionAlgorithm = "A128GCM" | "A192GCM" | "A256GCM";

export const LENGTH_IN_BITS = {
  A128GCM: 128,
  A192GCM: 192,
  A256GCM: 256,
} as const satisfies Record<ContentEncryptionAlgorithm, number>;

export const BYTE = 8;

export class AES {
  private constructor(public readonly origin: CryptoKey) {}

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

  public async encrypt(data: string): Promise<AESEncryption> {
    const iv = generateCryptoRandomValues(12);
    const tagLength = 128;

    const ciphertextAndAuthTag = await crypto.subtle.encrypt(
      { ...this.origin.algorithm, iv, tagLength },
      this.origin,
      textToBuf(data),
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
