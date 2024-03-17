import { bufToHex } from "./buf_to_hex";
import { hexToBuf } from "./hex_to_buf";

describe("hex and buf", () => {
  it.each`
    input                                 | output
    ${"0cdb4344e014e34b3334d004d33a5630"} | ${[12, 219, 67, 68, 224, 20, 227, 75, 51, 52, 208, 4, 211, 58, 86, 48]}
    ${""}                                 | ${[]}
  `("should correct encode/decode", ({ input, output }: { input: string; output: number[] }) => {
    const buf = new Uint8Array(output).buffer;

    expect(hexToBuf(input)).toEqual(buf);
    expect(bufToHex(buf)).toEqual(input);
  });
});
