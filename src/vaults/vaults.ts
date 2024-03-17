import { JSONValue, JsonWebEncryption, RSA, base64ToBuf, bufToBase64 } from "../common";
import { EncryptedVault, Vault } from "./types";

export async function encryptByPublicKey<TOverview extends JSONValue>(
  vault: Vault<TOverview>,
  publicKey: RSA.PublicKey,
): Promise<EncryptedVault> {
  const [encKey, encOverview] = await Promise.all([
    new JsonWebEncryption()
      .setKeyEncryptionAlgorithm("RSA-OAEP-256")
      .setContentEncryptionAlgorithm("A256GCM")
      .encrypt(publicKey.origin, bufToBase64(vault.key)),
    new JsonWebEncryption()
      .setKeyEncryptionAlgorithm("dir")
      .setContentEncryptionAlgorithm("A256GCM")
      .encrypt(vault.key, JSON.stringify(vault.overview)),
  ]);

  return {
    encKey,
    encOverview,
  };
}

export async function decryptByPrivateKey<TOverview extends JSONValue>(
  { encKey, encOverview }: EncryptedVault,
  privateKey: RSA.PrivateKey,
): Promise<Vault<TOverview>> {
  const key = await JsonWebEncryption.decrypt(encKey, privateKey.origin).then(base64ToBuf);
  const overview = await JsonWebEncryption.decrypt(encOverview, key).then(JSON.parse);

  return {
    key,
    overview,
  };
}

export async function encryptBySymKey<TOverview extends JSONValue>(
  vault: Vault<TOverview>,
  symKey: ArrayBuffer,
): Promise<EncryptedVault> {
  const [encKey, encOverview] = await Promise.all([
    new JsonWebEncryption()
      .setKeyEncryptionAlgorithm("dir")
      .setContentEncryptionAlgorithm("A256GCM")
      .encrypt(symKey, bufToBase64(vault.key)),
    new JsonWebEncryption()
      .setKeyEncryptionAlgorithm("dir")
      .setContentEncryptionAlgorithm("A256GCM")
      .encrypt(vault.key, JSON.stringify(vault.overview)),
  ]);

  return {
    encKey,
    encOverview,
  };
}

export async function decryptBySymKey<TOverview extends JSONValue>(
  { encKey, encOverview }: EncryptedVault,
  symKey: ArrayBuffer,
): Promise<Vault<TOverview>> {
  const key = await JsonWebEncryption.decrypt(encKey, symKey).then(base64ToBuf);
  const overview = await JsonWebEncryption.decrypt(encOverview, key).then(JSON.parse);

  return {
    key,
    overview,
  };
}
