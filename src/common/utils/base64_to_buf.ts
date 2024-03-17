export function base64ToBuf(a: string): ArrayBuffer {
  return Uint8Array.from(atob(a), (c) => c.charCodeAt(0)).buffer;
}
