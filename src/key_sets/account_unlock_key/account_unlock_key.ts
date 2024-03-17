import { textToBuf } from "../../common";

function normalizePassword(password: string): string {
  return password.trim().normalize("NFKD");
}

export function deriveKey(password: string): ArrayBuffer {
  return textToBuf(normalizePassword(password));
}
