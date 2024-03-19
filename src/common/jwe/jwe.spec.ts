import { faker } from "@faker-js/faker";
import { generateCryptoRandomValues } from "../generate_crypto_random_values";
import { JsonWebEncryption } from "./jwe";
import { ContentEncryptionAlgorithm, KeyEncryptionAlgorithm, SerializationType } from "./types";
import { RSA } from "../rsa";
import {
  ContentEncryptionAlgorithmNotSpecifiedError,
  KeyEncryptionAlgorithmNotSpecifiedError,
  UnknownSerializationError,
} from "./errors";
import { generateCryptoRandomString } from "../generate_crypto_random_string";

describe("jwe", () => {
  describe("symmetric", () => {
    it.each<{ alg: KeyEncryptionAlgorithm; enc: ContentEncryptionAlgorithm; format: SerializationType }>([
      { alg: "PBES2-HS256+A128KW", enc: "A128GCM", format: "json" },
      { alg: "PBES2-HS256+A128KW", enc: "A128GCM", format: "compact" },
      { alg: "PBES2-HS256+A128KW", enc: "A192GCM", format: "json" },
      { alg: "PBES2-HS256+A128KW", enc: "A192GCM", format: "compact" },
      { alg: "PBES2-HS256+A128KW", enc: "A256GCM", format: "json" },
      { alg: "PBES2-HS256+A128KW", enc: "A256GCM", format: "compact" },
      { alg: "dir", enc: "A128GCM", format: "json" },
      { alg: "dir", enc: "A128GCM", format: "compact" },
      { alg: "dir", enc: "A192GCM", format: "json" },
      { alg: "dir", enc: "A192GCM", format: "compact" },
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
      { alg: "RSA-OAEP", enc: "A128GCM", format: "json" },
      { alg: "RSA-OAEP", enc: "A128GCM", format: "compact" },
      { alg: "RSA-OAEP", enc: "A192GCM", format: "json" },
      { alg: "RSA-OAEP", enc: "A192GCM", format: "compact" },
      { alg: "RSA-OAEP", enc: "A256GCM", format: "json" },
      { alg: "RSA-OAEP", enc: "A256GCM", format: "compact" },
      { alg: "RSA-OAEP-256", enc: "A128GCM", format: "json" },
      { alg: "RSA-OAEP-256", enc: "A128GCM", format: "compact" },
      { alg: "RSA-OAEP-256", enc: "A192GCM", format: "json" },
      { alg: "RSA-OAEP-256", enc: "A192GCM", format: "compact" },
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

  it("should throw an error if the 'alg' was not specified", () => {
    const TEST_TEXT = faker.string.alpha({ length: { min: 4, max: 16 } });
    const key = generateCryptoRandomValues(32);

    expect(
      new JsonWebEncryption().setContentEncryptionAlgorithm("A256GCM").encrypt(key, TEST_TEXT),
    ).rejects.toThrowError(KeyEncryptionAlgorithmNotSpecifiedError);
  });

  it("should throw an error if the 'enc' was not specified", () => {
    const TEST_TEXT = faker.string.alpha({ length: { min: 4, max: 16 } });
    const key = generateCryptoRandomValues(32);

    expect(
      new JsonWebEncryption().setKeyEncryptionAlgorithm("PBES2-HS512+A256KW").encrypt(key, TEST_TEXT),
    ).rejects.toThrowError(ContentEncryptionAlgorithmNotSpecifiedError);
  });

  it("should throw an error if the serialization is unknown", () => {
    const TEST_TEXT = faker.string.alpha({ length: { min: 4, max: 16 } });
    const key = generateCryptoRandomValues(32);
    const fakeSerialization = generateCryptoRandomString(32) as SerializationType;

    expect(
      new JsonWebEncryption()
        .setKeyEncryptionAlgorithm("PBES2-HS512+A256KW")
        .setContentEncryptionAlgorithm("A256GCM")
        .encrypt(key, TEST_TEXT, fakeSerialization),
    ).rejects.toThrowError(UnknownSerializationError);
  });
});
