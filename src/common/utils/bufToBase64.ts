export function bufToBase64(buf: ArrayBuffer): string {
  buf = new Uint8Array(buf);

  const output: string[] = [];

  for (let i = 0; i < (buf as Uint8Array).length; ++i) {
    output.push(String.fromCharCode((buf as Uint8Array)[i]));
  }

  return btoa(output.join(""));
}
