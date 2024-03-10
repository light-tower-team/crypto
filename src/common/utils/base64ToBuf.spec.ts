import { base64ToBuf } from "./base64ToBuf";
import { bufToBase64 } from "./bufToBase64";

describe("base64 and buf", () => {
  it("should correct encode/decode", () => {
    const base64 = "c29tZSB0ZXN0";

    const buf = base64ToBuf(base64);

    expect(bufToBase64(buf)).toEqual(base64);
  });
});
