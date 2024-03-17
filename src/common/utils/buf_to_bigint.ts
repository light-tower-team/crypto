export function bufToBigInt(buf: ArrayBuffer): bigint {
  let bits = 8n;

  buf = new Uint8Array(buf);

  let res = 0n;

  for (const i of (buf as Uint8Array).values()) {
    const bi = BigInt(i);

    res = (res << bits) + bi;
  }

  return res;
}
