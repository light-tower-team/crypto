import { faker } from "@faker-js/faker";
import { SymmetricKey } from ".";
import { AUK } from "../../auk";
import { AESEncryptionAlgorithm } from "../../common";

describe("symmetric key", () => {
  it("should be encrypted/decrypted by auk", async () => {
    const masterPassword = faker.string.alpha(10);

    const auk = await AUK.derive(masterPassword);

    const symmetricKey = await SymmetricKey.generate();

    const jwe = await SymmetricKey.encryptByAUK(symmetricKey, auk);

    const decrypted = await SymmetricKey.decryptByAUK(jwe, auk);

    expect(decrypted).toEqual(symmetricKey);
  });

  it.each`
    enc
    ${"A128GCM"}
    ${"A192GCM"}
    ${"A256GCM"}
  `("should support $enc encryption algorithm", async ({ enc }: { enc: AESEncryptionAlgorithm }) => {
    const masterPassword = faker.string.alpha(10);

    const auk = await AUK.derive(masterPassword);

    const symmetricKey = await SymmetricKey.generate(enc);

    const jwe = await SymmetricKey.encryptByAUK(symmetricKey, auk);

    const decrypted = await SymmetricKey.decryptByAUK(jwe, auk);

    expect(decrypted).toEqual(symmetricKey);
  });
});
