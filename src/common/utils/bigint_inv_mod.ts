export function bigIntInvMod(b: bigint, m: bigint): bigint {
  let t = 0n;
  let r = m;
  let newT = 1n;
  let newR = b;
  let q: bigint;
  let lastT: bigint;
  let lastR: bigint;

  while (newR !== 0n) {
    q = r / newR;
    lastT = t;
    lastR = r;
    t = newT;
    r = newR;
    newT = lastT - q * newT;
    newR = lastR - q * newR;
  }

  if (t < 0n) {
    t = t + m;
  }

  return t;
}
