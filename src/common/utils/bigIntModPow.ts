import { bigIntInvMod } from "./bigIntInvMod";

export function bigIntModPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;

  base = base % mod;

  if (exp < 0) {
    exp *= -1n;
    base = bigIntInvMod(base, mod);
  }

  if (base === 0n) {
    return 0n;
  }

  while (exp > 0n) {
    if (exp % 2n) {
      res = (res * base) % mod;
    }

    base = base ** 2n % mod;
    exp = exp >> 1n;
  }

  return res < 0 ? mod + res : res;
}
