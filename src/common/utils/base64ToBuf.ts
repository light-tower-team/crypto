export function base64ToBuf(a: string): ArrayBuffer {
  const encoder = new TextEncoder();

  return encoder.encode(atob(a)).buffer;
}
