import { bufToText } from "./buf_to_text";
import { textToBuf } from "./text_to_buf";

describe("text and buf", () => {
  it("should correct encode/decode", () => {
    const test = "hello, world!";
    const buf = new Uint8Array([104, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]).buffer;

    expect(textToBuf(test)).toEqual(buf);
    expect(bufToText(buf)).toEqual(test);
  });
});
