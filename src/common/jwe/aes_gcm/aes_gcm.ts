import { generateCryptoRandomValues } from "../../generate_crypto_random_values";
import { BYTE } from "../../units";
import { bufToText, concatBuffs, deriveCipherTextAndAuthTag } from "../../utils";
import { CryptoKeyLike } from "../types";

export async function encrypt(cek: CryptoKeyLike, plaintext: ArrayBuffer) {
  const iv = generateCryptoRandomValues(12);
  const tagLength = 128;

  const encKey =
    cek instanceof ArrayBuffer ? await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]) : cek;

  const ciphertextAndAuthTag = await crypto.subtle.encrypt(
    {
      iv,
      name: "AES-GCM",
      tagLength,
    },
    encKey,
    plaintext,
  );

  const { ciphertext, tag } = deriveCipherTextAndAuthTag(ciphertextAndAuthTag, tagLength);

  return { ciphertext, tag, iv };
}

export async function decrypt(
  cek: CryptoKeyLike,
  ciphertext: ArrayBuffer,
  tag: ArrayBuffer,
  iv: ArrayBuffer,
): Promise<string> {
  const tagLength = tag.byteLength * BYTE;

  const encKey =
    cek instanceof ArrayBuffer ? await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]) : cek;

  return bufToText(
    await crypto.subtle.decrypt(
      {
        iv,
        name: "AES-GCM",
        tagLength,
      },
      encKey,
      concatBuffs(ciphertext, tag),
    ),
  );
}
