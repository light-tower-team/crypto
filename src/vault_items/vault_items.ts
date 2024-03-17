import { JSONValue, JsonWebEncryption } from "../common";
import { EncryptedVaultItem, VaultItem } from "./types";

export async function encryptBySymKey<TOverview extends JSONValue = JSONValue, TDetails extends JSONValue = JSONValue>(
  vaultItem: VaultItem<TOverview, TDetails>,
  symKey: ArrayBuffer,
): Promise<EncryptedVaultItem> {
  const [encOverview, encDetails] = await Promise.all([
    new JsonWebEncryption()
      .setKeyEncryptionAlgorithm("dir")
      .setContentEncryptionAlgorithm("A256GCM")
      .encrypt(symKey, JSON.stringify(vaultItem.overview)),
    new JsonWebEncryption()
      .setKeyEncryptionAlgorithm("dir")
      .setContentEncryptionAlgorithm("A256GCM")
      .encrypt(symKey, JSON.stringify(vaultItem.details)),
  ]);

  return {
    encOverview,
    encDetails,
  };
}

export async function decryptBySymKey<TOverview extends JSONValue = JSONValue, TDetails extends JSONValue = JSONValue>(
  vaultItem: EncryptedVaultItem,
  symKey: ArrayBuffer,
): Promise<VaultItem<TOverview, TDetails>> {
  const [overview, details] = await Promise.all([
    JsonWebEncryption.decrypt(vaultItem.encOverview, symKey).then(JSON.parse),
    JsonWebEncryption.decrypt(vaultItem.encDetails, symKey).then(JSON.parse),
  ]);

  return {
    overview,
    details,
  };
}
