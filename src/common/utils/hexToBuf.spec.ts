import { bufToHex } from "./bufToHex";
import { hexToBuf } from "./hexToBuf";

describe("hex and buf", () => {
  it("should correct encode/decode", () => {
    const hex = "0cdb4344e014e34b3334d004d33a5630";
    const buf = new Uint8Array([
      12, 219, 67, 68, 224, 20, 227, 75, 51, 52, 208, 4, 211, 58, 86, 48,
    ]).buffer;

    expect(hexToBuf(hex)).toEqual(buf);
    expect(bufToHex(buf)).toEqual(hex);
  });
});
