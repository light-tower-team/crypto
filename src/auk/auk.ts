import { textToBuf } from "../common";

function normalizeMasterPassword(masterPassword: string): string {
  return masterPassword.trim().normalize("NFKD");
}

export async function deriveAUK(masterPassword: string): Promise<CryptoKey> {
  const normalizedMasterPassword = normalizeMasterPassword(masterPassword);

  const accountUnlockKey = await crypto.subtle.importKey("raw", textToBuf(normalizedMasterPassword), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);

  return accountUnlockKey;
}
