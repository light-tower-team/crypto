export function bufToText(buf: ArrayBuffer): string {
  return new TextDecoder().decode(new Uint8Array(buf));
}
