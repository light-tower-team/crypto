import { rsaoaep } from ".";
import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { RSA } from "../../rsa";
import { CryptoKeyRequiredError } from "./errors";

describe("rsa", () => {
  it("should encrypt/decrypt a cek", async () => {
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const cek = generateCryptoRandomValues(32);

    const encryptedCEK = await rsaoaep.encrypt(publicKey.origin, cek);

    const decryptedCEK = await rsaoaep.decrypt(privateKey.origin, encryptedCEK);

    expect(decryptedCEK).toEqual(cek);
  });

  it("should throw an error the encryption key is not a crypto key", () => {
    const cek = generateCryptoRandomValues(32);
    const unknownKey = generateCryptoRandomValues(16);

    expect(rsaoaep.encrypt(unknownKey, cek)).rejects.toThrow(CryptoKeyRequiredError);
  });

  it("should throw an error the decryption key is not a crypto key", () => {
    const cek = generateCryptoRandomValues(32);
    const unknownKey = generateCryptoRandomValues(16);

    expect(rsaoaep.decrypt(unknownKey, cek)).rejects.toThrow(CryptoKeyRequiredError);
  });
});
