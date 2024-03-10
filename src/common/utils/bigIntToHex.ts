export class NegativeIntegerError extends RangeError {
  public constructor() {
    super(
      "The 'a' should be a non-negative integer. Negative values are not supported."
    );
  }
}

export function bigIntToHex(a: bigint): string {
  if (a < 0) {
    throw new NegativeIntegerError();
  }

  let hex = a.toString(16);

  if (hex.length % 2) {
    hex = "0" + hex;
  }

  return hex;
}
