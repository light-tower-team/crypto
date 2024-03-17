import { RSA } from "../../common";
import { SymmetricKey } from "../symmetric_key";
import { PrivateKey } from "../private_key";
import { JsonWebEncryptionLike } from "../../common/jwe/types";

export interface PrimaryKeySet {
  symmetricKey: ArrayBuffer;
  publicKey: RSA.PublicKey;
  privateKey: RSA.PrivateKey;
}

export interface EncryptedPrimaryKeySet {
  encSymKey: JsonWebEncryptionLike;
  encPriKey: JsonWebEncryptionLike;
  pubKey: JsonWebKey;
}

export async function create(): Promise<PrimaryKeySet> {
  const [symmetricKey, { publicKey, privateKey }] = await Promise.all([
    SymmetricKey.generateKey(),
    RSA.generateKeyPair(),
  ]);

  return {
    symmetricKey,
    publicKey,
    privateKey,
  };
}

export async function encryptByAUK(
  { symmetricKey, publicKey, privateKey }: PrimaryKeySet,
  auk: ArrayBuffer,
): Promise<EncryptedPrimaryKeySet> {
  const [encSymKey, encPriKey, pubKey] = await Promise.all([
    SymmetricKey.encryptByAUK(symmetricKey, auk),
    PrivateKey.encryptBySymKey(privateKey.origin, symmetricKey),
    publicKey.toJWK(),
  ]);

  return {
    encPriKey,
    encSymKey,
    pubKey,
  };
}

export async function decryptByAUK(
  { encSymKey, encPriKey, pubKey }: EncryptedPrimaryKeySet,
  auk: ArrayBuffer,
): Promise<PrimaryKeySet> {
  const [symmetricKey, publicKey] = await Promise.all([
    SymmetricKey.decryptByAUK(encSymKey, auk),
    RSA.PublicKey.fromJWK(pubKey),
  ]);

  const privateKey = new RSA.PrivateKey(await PrivateKey.decryptBySymKey(encPriKey, symmetricKey));

  return {
    symmetricKey,
    publicKey,
    privateKey,
  };
}
