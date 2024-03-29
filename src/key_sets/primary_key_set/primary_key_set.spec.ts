import { faker } from "@faker-js/faker";
import { checkAsymmetricEncryption } from "../../common/rsa/__tests__/helpers/check_asymmetric_encryption";
import { AUK } from "../account_unlock_key";
import { PrimaryKeySet } from ".";

describe("primary key set", () => {
  it("should create a primary key set", async () => {
    const priKeySet = await PrimaryKeySet.create();

    expect(priKeySet).toHaveProperty("symmetricKey");
    expect(priKeySet).toHaveProperty("publicKey");
    expect(priKeySet).toHaveProperty("privateKey");
  });

  it("should encrypt/decrypt a primary key set", async () => {
    const TEST_PASSWORD = faker.internet.password();

    const auk = AUK.deriveKey(TEST_PASSWORD);

    const priKeySet = await PrimaryKeySet.create();

    const encPriKeySet = await PrimaryKeySet.encryptByAUK(priKeySet, auk);
    const decPriKeySet = await PrimaryKeySet.decryptByAUK(encPriKeySet, auk);

    expect(decPriKeySet.symmetricKey).toEqual(priKeySet.symmetricKey);

    expect(checkAsymmetricEncryption(priKeySet.publicKey, decPriKeySet.privateKey)).toBeTruthy();
    expect(checkAsymmetricEncryption(decPriKeySet.publicKey, priKeySet.privateKey)).toBeTruthy();
  });
});
