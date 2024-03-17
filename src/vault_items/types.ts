import { JSONValue, JsonWebEncryptionLike } from "../common";

export interface VaultItem<TOverview extends JSONValue = JSONValue, TDetails extends JSONValue = JSONValue> {
  overview: TOverview;
  details: TDetails;
}

export type EncryptedVaultItem = {
  encOverview: JsonWebEncryptionLike;
  encDetails: JsonWebEncryptionLike;
};
