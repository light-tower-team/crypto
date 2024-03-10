export function bufToBase64(buf: ArrayBuffer): string {
  const decoder = new TextDecoder();

  return btoa(decoder.decode(buf));
}
