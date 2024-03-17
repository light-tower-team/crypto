import { MODULUS_LENGTH, PUBLIC_EXPONENT } from "../../constants";

export function generateKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: MODULUS_LENGTH,
      publicExponent: PUBLIC_EXPONENT,
      hash: "SHA-256",
    },
    false,
    ["decrypt", "encrypt"],
  );
}
