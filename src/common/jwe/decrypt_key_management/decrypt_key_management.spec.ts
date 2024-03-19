import { generateCryptoRandomString } from "../../generate_crypto_random_string";
import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { decryptKeyManagement } from ".";
import { encryptKeyManagement } from "../encrypt_key_management/encrypt_key_management";
import {
  EncryptedKeyNotSpecifiedError,
  InputIterationCountNotSpecifiedError,
  InputSaltNotSpecifiedError,
  UnknownKeyEncryptionAlgorithmError,
} from "../errors";
import { KeyEncryptionAlgorithm } from "../types";
import { RSA } from "../../rsa";

describe("decrypt key management", () => {
  it("should throw an error when the key encryption algorithm is unknown", async () => {
    const { publicKey, privateKey } = await RSA.generateKeyPair();
    const fakeAlg = generateCryptoRandomString(32) as KeyEncryptionAlgorithm;

    const { encryptedKey, params } = await encryptKeyManagement("dir", "A256GCM", publicKey.origin);

    expect(decryptKeyManagement(fakeAlg, privateKey.origin, encryptedKey, params)).rejects.toThrowError(
      UnknownKeyEncryptionAlgorithmError,
    );
  });

  it("should throw an error when the key encryption algorithm is 'RSA-OAEP' but 'encryptedKey' is not specified", async () => {
    const { publicKey, privateKey } = await RSA.generateKeyPair();
    const { params } = await encryptKeyManagement("RSA-OAEP", "A256GCM", publicKey.origin);

    expect(decryptKeyManagement("RSA-OAEP", privateKey.origin, undefined, params)).rejects.toThrowError(
      EncryptedKeyNotSpecifiedError,
    );
  });

  it("should throw an error when the key encryption algorithm is 'PBES2' but 'encryptedKey' is not specified", async () => {
    const key = generateCryptoRandomValues(32);
    const { params } = await encryptKeyManagement("PBES2-HS512+A256KW", "A256GCM", key);

    expect(decryptKeyManagement("PBES2-HS512+A256KW", key, undefined, params)).rejects.toThrowError(
      EncryptedKeyNotSpecifiedError,
    );
  });

  it("should throw an error when the key encryption algorithm is 'PBES2' but 'p2s' is not specified", async () => {
    const key = generateCryptoRandomValues(32);
    const { encryptedKey, params } = await encryptKeyManagement("PBES2-HS512+A256KW", "A256GCM", key);

    expect(
      decryptKeyManagement("PBES2-HS512+A256KW", key, encryptedKey, { ...params, p2s: undefined }),
    ).rejects.toThrowError(InputSaltNotSpecifiedError);
  });

  it("should throw an error when the key encryption algorithm is 'PBES2' but 'p2c' is not specified", async () => {
    const key = generateCryptoRandomValues(32);
    const { encryptedKey, params } = await encryptKeyManagement("PBES2-HS512+A256KW", "A256GCM", key);

    expect(
      decryptKeyManagement("PBES2-HS512+A256KW", key, encryptedKey, { ...params, p2c: undefined }),
    ).rejects.toThrowError(InputIterationCountNotSpecifiedError);
  });
});
