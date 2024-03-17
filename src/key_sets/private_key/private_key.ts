import { JsonWebEncryption } from "../../common";
import { RSA_OAEP_ALGORITHMS } from "../../common/jwe/constants";
import { JsonWebEncryptionLike, RSA_AOEP_KeyEncryptionAlgorithm } from "../../common/jwe/types";

async function privateKeyToRaw(privateKey: CryptoKey): Promise<string> {
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);

  return JSON.stringify(jwk);
}

async function privateKeyFromRaw(privateKey: string): Promise<CryptoKey> {
  const jwk: JsonWebKey = JSON.parse(privateKey);

  const alg = RSA_OAEP_ALGORITHMS[jwk.alg! as RSA_AOEP_KeyEncryptionAlgorithm];

  return crypto.subtle.importKey("jwk", jwk, alg, jwk.ext!, jwk.key_ops! as KeyUsage[]);
}

export async function encryptBySymKey(privateKey: CryptoKey, symKey: ArrayBuffer): Promise<string> {
  return new JsonWebEncryption()
    .setKeyEncryptionAlgorithm("dir")
    .setContentEncryptionAlgorithm("A256GCM")
    .encrypt(symKey, await privateKeyToRaw(privateKey));
}

export async function decryptBySymKey(jwe: JsonWebEncryptionLike, symKey: ArrayBuffer): Promise<CryptoKey> {
  return privateKeyFromRaw(await JsonWebEncryption.decrypt(jwe, symKey));
}
