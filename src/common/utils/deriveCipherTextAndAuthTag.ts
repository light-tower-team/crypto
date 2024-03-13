import { BYTE } from "../units";

export interface CiphertextAndAuthTag {
  ciphertext: ArrayBuffer;
  tag: ArrayBuffer;
}

export function deriveCipherTextAndAuthTag(
  cipherTextAndAuthTag: ArrayBuffer,
  authTagLength: number,
): CiphertextAndAuthTag {
  const divider = cipherTextAndAuthTag.byteLength - authTagLength / BYTE;

  const ciphertext = cipherTextAndAuthTag.slice(0, divider);
  const authTag = cipherTextAndAuthTag.slice(divider);

  return { ciphertext, tag: authTag };
}
