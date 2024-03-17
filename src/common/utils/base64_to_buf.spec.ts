import { generateCryptoRandomValues } from "..";
import { base64ToBuf } from "./base64_to_buf";
import { bufToBase64 } from "./buf_to_base64";

describe("base64 and buf", () => {
  it("should correct encode/decode", () => {
    const buf = generateCryptoRandomValues();

    const base64 = bufToBase64(buf);

    expect(base64ToBuf(base64)).toEqual(buf);
  });
});
