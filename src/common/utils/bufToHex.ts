export function bufToHex(buf: ArrayBuffer): string {
  const h = "0123456789abcdef";

  let s = "";

  buf = new Uint8Array(buf);

  (buf as Uint8Array).forEach((v) => {
    s += h[v >> 4] + h[v & 15];
  });

  return s;
}
