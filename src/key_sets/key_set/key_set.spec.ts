import { RSA } from "../../common";
import { KeySet } from ".";

describe("key set", () => {
  it("should create a secondary key set", () => {
    const secKeySet = KeySet.create();

    expect(secKeySet).toHaveProperty("symmetricKey");
  });

  it("should encrypt/decrypt a secondary key set", async () => {
    const { privateKey, publicKey } = await RSA.generateKeyPair();

    const secKeySet = KeySet.create();

    const encSecKeySet = await KeySet.encryptByPrivateKey(secKeySet, publicKey);

    expect(KeySet.decryptByPublicKey(encSecKeySet, privateKey)).resolves.toEqual(secKeySet);
  });
});
