import { generateCryptoRandomString } from "../../generate_crypto_random_string";
import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { encryptKeyManagement } from ".";
import { UnknownKeyEncryptionAlgorithmError } from "../errors";
import { KeyEncryptionAlgorithm } from "../types";

describe("encrypt key management", () => {
  it("should throw an error when the key encryption algorithm is unknown", () => {
    const fakeAlg = generateCryptoRandomString(32) as KeyEncryptionAlgorithm;
    const cek = generateCryptoRandomValues(32);

    expect(encryptKeyManagement(fakeAlg, "A256GCM", cek)).rejects.toThrowError(UnknownKeyEncryptionAlgorithmError);
  });
});
