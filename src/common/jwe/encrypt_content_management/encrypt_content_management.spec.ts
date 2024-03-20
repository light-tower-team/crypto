import { generateCryptoRandomString } from "../../generate_crypto_random_string";
import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { textToBuf } from "../../utils";
import { UnknownContentEncryptionAlgorithmError } from "../errors";
import { AES_GCM_ContentEncryptionAlgorithm } from "../types";
import { encrypt } from ".";

describe("encrypt", () => {
  it("should throw an error when the content encryption algorithm is unknown", () => {
    const fakeAlg = generateCryptoRandomString(32) as AES_GCM_ContentEncryptionAlgorithm;
    const cek = generateCryptoRandomValues(32);
    const plaintext = generateCryptoRandomString(32);

    expect(() => encrypt(fakeAlg, cek, textToBuf(plaintext))).toThrowError(UnknownContentEncryptionAlgorithmError);
  });
});
