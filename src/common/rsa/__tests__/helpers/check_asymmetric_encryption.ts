import { faker } from "@faker-js/faker";
import { RSA } from "../..";

export async function checkAsymmetricEncryption(
  publicKey: RSA.PublicKey,
  privateKey: RSA.PrivateKey,
): Promise<boolean> {
  const plaintext = faker.string.alpha({ length: { min: 4, max: 32 } });

  const ciphertext = await publicKey.encrypt(plaintext);

  const decryptedPlaintext = await privateKey.decrypt(ciphertext);

  return decryptedPlaintext === plaintext;
}
