export function hexToBuf(hex: string): ArrayBuffer {
  return Uint8Array.from(
    hex.match(/[\da-fA-F]{2}/g)?.map((h) => parseInt(h, 16)) ?? []
  ).buffer;
}
