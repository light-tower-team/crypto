export class NotInvertibleError extends Error {
  public constructor() {
    super("The 'a' is not invertible.");
  }
}

export function bigIntInvMod(a: bigint, n: bigint): bigint {
  let t = 0n;
  let r = n;
  let newT = 1n;
  let newR = a;
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

  if (r > 1n) {
    throw new NotInvertibleError();
  }

  if (t < 0n) {
    t = t + n;
  }

  return t;
}
