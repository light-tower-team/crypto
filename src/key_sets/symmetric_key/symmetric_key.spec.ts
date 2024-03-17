import { faker } from "@faker-js/faker";
import { SymmetricKey } from ".";
import { AUK } from "../account_unlock_key";

describe("symmetric key", () => {
  it("should generate a symmetric key", () => {
    const key = SymmetricKey.generateKey();

    expect(key).toBeInstanceOf(ArrayBuffer);
    expect(key.byteLength).toEqual(32);
  });

  it("should encrypt/decrypt by AUK", async () => {
    const password = faker.internet.password();
    const auk = AUK.deriveKey(password);
    const symKey = SymmetricKey.generateKey();

    const jwe = await SymmetricKey.encryptByAUK(symKey, auk);

    expect(SymmetricKey.decryptByAUK(jwe, auk)).resolves.toEqual(symKey);
  });
});
