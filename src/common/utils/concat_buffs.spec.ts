import { concatBuffs } from "./concat_buffs";

describe("concatBuffs", () => {
  it.each`
    buffers                                 | result
    ${[[]]}                                 | ${[]}
    ${[[64, 23]]}                           | ${[64, 23]}
    ${[[82, 64, 23], [56, 60]]}             | ${[82, 64, 23, 56, 60]}
    ${[[82, 64, 23], [56, 60], [36, 0, 0]]} | ${[82, 64, 23, 56, 60, 36, 0, 0]}
  `(
    "should concat $buffers array buffers to $result",
    ({ buffers, result }: { buffers: number[][]; result: number[] }) => {
      expect(concatBuffs(...buffers.map((buf) => new Uint8Array(buf).buffer))).toEqual(new Uint8Array(result).buffer);
    },
  );
});
