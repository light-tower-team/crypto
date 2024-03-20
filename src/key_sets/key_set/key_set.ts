import { JsonWebEncryption, RSA, textToBuf } from "../../common";
import { JsonWebEncryptionLike } from "../../common/jwe/types";
import { SymmetricKey } from "../symmetric_key";

export interface KeySet {
  symmetricKey: ArrayBuffer;
}

export interface EncryptedKeySet {
  encSymKey: JsonWebEncryptionLike;
}

export function create(): KeySet {
  const symmetricKey = SymmetricKey.generateKey();

  return {
    symmetricKey,
  };
}

export async function encryptByPrivateKey(
  { symmetricKey }: KeySet,
  publicKey: RSA.PublicKey,
): Promise<EncryptedKeySet> {
  const encSymKey = await new JsonWebEncryption()
    .setKeyEncryptionAlgorithm("RSA-OAEP-256")
    .setContentEncryptionAlgorithm("A256GCM")
    .encrypt(publicKey.origin, symmetricKey);

  return {
    encSymKey,
  };
}

export async function decryptByPublicKey({ encSymKey }: EncryptedKeySet, privateKey: RSA.PrivateKey): Promise<KeySet> {
  const symmetricKey = textToBuf(await JsonWebEncryption.decrypt(encSymKey, privateKey.origin));

  return {
    symmetricKey,
  };
}
