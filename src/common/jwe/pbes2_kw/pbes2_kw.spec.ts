import { pbes2kw } from ".";
import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { PBES2_KeyEncryptionAlgorithm } from "../types";

describe("pbes2 kw", () => {
  it.each<{ alg: PBES2_KeyEncryptionAlgorithm }>([
    { alg: "PBES2-HS256+A128KW" },
    { alg: "PBES2-HS384+A192KW" },
    { alg: "PBES2-HS512+A256KW" },
  ])("should encrypt/decrypt a cek through $alg algorithm", async ({ alg }) => {
    const key = generateCryptoRandomValues(32);
    const cek = generateCryptoRandomValues(32);

    const { encryptedKey, p2s, p2c } = await pbes2kw.encrypt(alg, key, cek);

    const decryptedKey = await pbes2kw.decrypt(alg, key, encryptedKey, p2s, p2c);

    expect(decryptedKey).toEqual(cek);
  });

  it.each<{ alg: PBES2_KeyEncryptionAlgorithm }>([
    { alg: "PBES2-HS256+A128KW" },
    { alg: "PBES2-HS384+A192KW" },
    { alg: "PBES2-HS512+A256KW" },
  ])("should encrypt/decrypt a cek through $alg algorithm with already a provided crypto key", async ({ alg }) => {
    const key = await crypto.subtle.importKey("raw", generateCryptoRandomValues(32), "PBKDF2", false, ["deriveKey"]);
    const cek = generateCryptoRandomValues(32);

    const { encryptedKey, p2s, p2c } = await pbes2kw.encrypt(alg, key, cek);

    const decryptedKey = await pbes2kw.decrypt(alg, key, encryptedKey, p2s, p2c);

    expect(decryptedKey).toEqual(cek);
  });
});
