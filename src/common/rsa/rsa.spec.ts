import { faker } from "@faker-js/faker";
import { RSA } from ".";

describe("rsa", () => {
  it("should encrypt and decrypt data", async () => {
    const TEST_TEXT = faker.string.alpha(10);
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const ciphertext = await publicKey.encrypt(TEST_TEXT);

    expect(privateKey.decrypt(ciphertext)).resolves.toEqual(TEST_TEXT);
  });

  it("should convert the public key to jwk format", async () => {
    const { publicKey } = await RSA.generateKeyPair();

    const jwk = await publicKey.toJWK();

    expect(jwk).toHaveProperty("kty", "RSA");
    expect(jwk).toHaveProperty("alg", "RSA-OAEP-256");
    expect(jwk).toHaveProperty("ext", true);
    expect(jwk).toHaveProperty("key_ops", ["encrypt", "wrapKey"]);
  });
});
