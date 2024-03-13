import { concatBuffs, textToBuf, bufToBase64, base64ToBuf, bufToText, deriveCipherTextAndAuthTag } from "../utils";
import { generateCryptoRandomValues } from "../generateCryptoRandomValues";
import { AESEncryption, AESEncryptionAlgorithm } from "../jwe";
import { AUTH_TAG_LENGTH, INITIALIZATION_VECTOR_LENGTH, AES_ALGORITHMS } from "./constants";
import { IncorrectOriginCryptoKeyError, UnknownEncryptionAlgorithmError } from "../errors";
import { BYTE } from "../units";

export class AES {
  public get enc(): AESEncryptionAlgorithm {
    const algorithm = this.origin.algorithm as { name: string; length: number };

    const [enc] =
      Object.entries(AES_ALGORITHMS).find(
        ([_, alg]) => alg.name === algorithm.name && alg.length === algorithm.length,
      ) ?? [];

    if (!enc) {
      throw new UnknownEncryptionAlgorithmError();
    }

    return enc as AESEncryptionAlgorithm;
  }

  public constructor(public readonly origin: CryptoKey) {
    if (!this.origin.algorithm.name.startsWith("AES") || this.origin.type !== "secret") {
      throw new IncorrectOriginCryptoKeyError();
    }
  }

  public static async generateKey(enc: AESEncryptionAlgorithm = "A256GCM"): Promise<AES> {
    const key = await crypto.subtle.generateKey(AES_ALGORITHMS[enc], true, [
      "wrapKey",
      "unwrapKey",
      "encrypt",
      "decrypt",
    ]);

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

    const { ciphertext, tag } = deriveCipherTextAndAuthTag(ciphertextAndAuthTag, tagLength);

    return {
      enc: this.enc,
      cty: "jwk+json",
      iv: bufToBase64(iv),
      tag: bufToBase64(tag),
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
