import { RSA_OAEP_ALGORITHMS } from "../jwe/constants";
import { RSA_AOEP_KeyEncryptionAlgorithm } from "../jwe/types";
import { base64ToBuf, bufToBase64, bufToText, textToBuf } from "../utils";
import { MODULUS_LENGTH, PUBLIC_EXPONENT } from "./constants";
import { IncorrectOriginCryptoKeyError } from "./errors";

export interface KeyPair {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

export class PublicKey {
  public constructor(public readonly origin: CryptoKey) {
    if (!this.origin.algorithm.name.startsWith("RSA-OAEP") || this.origin.type !== "public") {
      throw new IncorrectOriginCryptoKeyError();
    }
  }

  public async encrypt(plaintext: string): Promise<string> {
    const ciphertext = bufToBase64(
      await crypto.subtle.encrypt(this.origin.algorithm, this.origin, textToBuf(plaintext)),
    );

    return ciphertext;
  }

  public toJWK(): Promise<JsonWebKey> {
    return crypto.subtle.exportKey("jwk", this.origin);
  }

  public static async fromJWK(jwk: JsonWebKey): Promise<PublicKey> {
    const alg = RSA_OAEP_ALGORITHMS[jwk.alg as RSA_AOEP_KeyEncryptionAlgorithm];

    return new PublicKey(await crypto.subtle.importKey("jwk", jwk, alg, jwk.ext!, jwk.key_ops! as KeyUsage[]));
  }
}

export class PrivateKey {
  public constructor(public readonly origin: CryptoKey) {
    if (!this.origin.algorithm.name.startsWith("RSA-OAEP") || this.origin.type !== "private") {
      throw new IncorrectOriginCryptoKeyError();
    }
  }

  public async decrypt(ciphertext: string): Promise<string> {
    const plaintext = bufToText(
      await crypto.subtle.decrypt(this.origin.algorithm, this.origin, base64ToBuf(ciphertext)),
    );

    return plaintext;
  }

  public toJWK(): Promise<JsonWebKey> {
    return crypto.subtle.exportKey("jwk", this.origin);
  }

  public static async fromJWK(jwk: JsonWebKey): Promise<PrivateKey> {
    const alg = RSA_OAEP_ALGORITHMS[jwk.alg as RSA_AOEP_KeyEncryptionAlgorithm];

    return new PrivateKey(await crypto.subtle.importKey("jwk", jwk, alg, jwk.ext!, jwk.key_ops! as KeyUsage[]));
  }
}

export async function generateKeyPair(): Promise<KeyPair> {
  const { publicKey, privateKey } = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: MODULUS_LENGTH,
      publicExponent: PUBLIC_EXPONENT,
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  return {
    publicKey: new PublicKey(publicKey),
    privateKey: new PrivateKey(privateKey),
  };
}
