import { faker } from "@faker-js/faker";
import { generateCryptoRandomValues } from "../generate_crypto_random_values";
import { JsonWebEncryption } from "./jwe";
import { ContentEncryptionAlgorithm, KeyEncryptionAlgorithm, SerializationType } from "./types";
import { RSA } from "../rsa";

describe("jwe", () => {
  describe("symmetric", () => {
    it.each<{ alg: KeyEncryptionAlgorithm; enc: ContentEncryptionAlgorithm; format: SerializationType }>([
      { alg: "PBES2-HS256+A128KW", enc: "A256GCM", format: "json" },
      { alg: "PBES2-HS256+A128KW", enc: "A256GCM", format: "compact" },
      { alg: "dir", enc: "A256GCM", format: "json" },
      { alg: "dir", enc: "A256GCM", format: "compact" },
    ])("should perform encryption with $alg and $enc in $format format", async ({ alg, enc, format }) => {
      const TEST_TEXT = faker.string.alpha({ length: { min: 4, max: 16 } });
      const key = generateCryptoRandomValues(32);

      const jwe = await new JsonWebEncryption()
        .setKeyEncryptionAlgorithm(alg)
        .setContentEncryptionAlgorithm(enc)
        .encrypt(key, TEST_TEXT, format);

      const decrypted = JsonWebEncryption.decrypt(jwe, key);

      expect(decrypted).resolves.toEqual(TEST_TEXT);
    });
  });

  describe("asymmetric", () => {
    it.each<{ alg: KeyEncryptionAlgorithm; enc: ContentEncryptionAlgorithm; format: SerializationType }>([
      { alg: "RSA-OAEP", enc: "A256GCM", format: "json" },
      { alg: "RSA-OAEP", enc: "A256GCM", format: "compact" },
      { alg: "RSA-OAEP-256", enc: "A256GCM", format: "json" },
      { alg: "RSA-OAEP-256", enc: "A256GCM", format: "compact" },
    ])("should perform encryption with $alg and $enc in $format format", async ({ alg, enc, format }) => {
      const TEST_TEXT = faker.string.alpha({ length: { min: 4, max: 16 } });
      const { publicKey, privateKey } = await RSA.generateKeyPair();

      const jwe = await new JsonWebEncryption()
        .setKeyEncryptionAlgorithm(alg)
        .setContentEncryptionAlgorithm(enc)
        .encrypt(publicKey.origin, TEST_TEXT, format);

      const decrypted = JsonWebEncryption.decrypt(jwe, privateKey.origin);

      expect(decrypted).resolves.toEqual(TEST_TEXT);
    });
  });
});
