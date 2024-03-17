import { RSA, generateCryptoRandomValues } from "../../common";
import { PrivateKey } from ".";
import { faker } from "@faker-js/faker";

describe("private key", () => {
  it("should encrypt/decrypt the private key", async () => {
    const TEST_PLAINTEXT = faker.string.alpha({ length: { min: 12, max: 24 } });
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const symKey = generateCryptoRandomValues(32);

    const jwe = await PrivateKey.encryptBySymKey(privateKey.origin, symKey);

    const ciphertext = await publicKey.encrypt(TEST_PLAINTEXT);

    const decryptedPrivateKey = new RSA.PrivateKey(await PrivateKey.decryptBySymKey(jwe, symKey));

    expect(decryptedPrivateKey.decrypt(ciphertext)).resolves.toEqual(TEST_PLAINTEXT);
  });
});
