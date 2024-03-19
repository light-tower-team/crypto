import { generateCryptoRandomString } from "../../generate_crypto_random_string";
import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { textToBuf } from "../../utils";
import { decrypt } from ".";
import { encrypt } from "../encrypt_content_management/encrypt_content_management";
import { UnknownContentEncryptionAlgorithmError } from "../errors";
import { AES_GCM_ContentEncryptionAlgorithm } from "../types";

describe("decrypt", () => {
  it("should throw an error when the content encryption algorithm is unknown", async () => {
    const fakeAlg = generateCryptoRandomString(32) as AES_GCM_ContentEncryptionAlgorithm;
    const cek = generateCryptoRandomValues(32);
    const plaintext = generateCryptoRandomString(32);

    const { ciphertext, tag, iv } = await encrypt("A256GCM", cek, textToBuf(plaintext));

    expect(() => decrypt(fakeAlg, cek, ciphertext, tag, iv)).toThrowError(UnknownContentEncryptionAlgorithmError);
  });
});
