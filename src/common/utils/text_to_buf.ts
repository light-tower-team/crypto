export function textToBuf(text: string): ArrayBuffer {
  return new TextEncoder().encode(text).buffer;
}
