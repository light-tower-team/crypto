import { aesgcm } from ".";
import { generateCryptoRandomString } from "../../generate_crypto_random_string";
import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { textToBuf } from "../../utils";

describe("aes gcm", () => {
  it("should encrypt/decrypt plaintext", async () => {
    const cek = generateCryptoRandomValues(32);
    const plaintext = generateCryptoRandomString(32);

    const { ciphertext, tag, iv } = await aesgcm.encrypt(cek, textToBuf(plaintext));

    const decryptedPlaintext = await aesgcm.decrypt(cek, ciphertext, tag, iv);

    expect(decryptedPlaintext).toEqual(plaintext);
  });

  it("should encrypt/decrypt plaintext with already a provided crypto key", async () => {
    const cek = await crypto.subtle.importKey("raw", generateCryptoRandomValues(32), "AES-GCM", false, [
      "encrypt",
      "decrypt",
    ]);
    const plaintext = generateCryptoRandomString(32);

    const { ciphertext, tag, iv } = await aesgcm.encrypt(cek, textToBuf(plaintext));

    const decryptedPlaintext = await aesgcm.decrypt(cek, ciphertext, tag, iv);

    expect(decryptedPlaintext).toEqual(plaintext);
  });
});
