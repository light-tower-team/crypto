import { JSONValue, JsonWebEncryptionLike } from "../common";

export interface Vault<TOverview extends JSONValue = JSONValue> {
  key: ArrayBuffer;
  overview: TOverview;
}

export interface EncryptedVault {
  encKey: JsonWebEncryptionLike;
  encOverview: JsonWebEncryptionLike;
}
