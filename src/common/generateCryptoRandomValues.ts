export function generateCryptoRandomValues(bytes = 32): ArrayBuffer {
  return crypto.getRandomValues(new Uint8Array(bytes)).buffer;
}
