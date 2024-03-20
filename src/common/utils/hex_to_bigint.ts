export class IncorrectHexStringError extends RangeError {
  public constructor() {
    super("The 'hex' must be a hexadecimal string, e.g. '0x124fe3a' or '124fe3a'.");
  }
}

export function hexToBigInt(hex: string): bigint {
  const h = hex.replace(/\s+/g, "").match(/^(0x)?([\da-fA-F]+)$/);

  if (!h) {
    throw new IncorrectHexStringError();
  }

  hex = h[2];

  const a = BigInt(`0x${hex}`);

  return a;
}
