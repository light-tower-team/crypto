import { NegativeIntegerError, bigIntToHex } from "./bigIntToHex";
import { IncorrectHexStringError, hexToBigInt } from "./hexToBigInt";

describe("bigint and hex", () => {
  it("should correct encode/decode", () => {
    const a = 17089213339746507438148031875678623280n;

    const hex = "0cdb4344e014e34b3334d004d33a5630";

    expect(bigIntToHex(a)).toEqual(hex);

    expect(hexToBigInt(hex)).toEqual(a);
  });

  it("should throw an error when trying to encode/decode a negative integer", () => {
    const a = -17089213339746507438148031875678623280n;

    expect(() => bigIntToHex(a)).toThrowError(NegativeIntegerError);
  });

  it("should throw an error when trying to decode an empty hex", () => {
    expect(() => hexToBigInt("")).toThrowError(IncorrectHexStringError);
  });
});
