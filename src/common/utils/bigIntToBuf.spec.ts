import { bigIntToBuf } from "./bigIntToBuf";
import { NegativeIntegerError } from "./bigIntToHex";
import { bufToBigInt } from "./bufToBigInt";

describe("bigint and buf", () => {
  it("should correct encode/decode", () => {
    const a = 17089213339746507438148031875678623280n;
    const buf = new Uint8Array([
      12, 219, 67, 68, 224, 20, 227, 75, 51, 52, 208, 4, 211, 58, 86, 48,
    ]).buffer;

    expect(bigIntToBuf(a)).toEqual(buf);
    expect(bufToBigInt(buf)).toEqual(a);
  });

  it("should throw an error when trying to encode/decode a negative integer", () => {
    const a = -17089213339746507438148031875678623280n;

    expect(() => bigIntToBuf(a)).toThrowError(NegativeIntegerError);
  });
});
