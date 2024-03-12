import { generateCryptoRandomValues } from "..";
import { base64ToBuf } from "./base64ToBuf";
import { bufToBase64 } from "./bufToBase64";

describe("base64 and buf", () => {
  it("should correct encode/decode", () => {
    const buf = generateCryptoRandomValues();

    const base64 = bufToBase64(buf);

    expect(base64ToBuf(base64)).toEqual(buf);
  });
});
