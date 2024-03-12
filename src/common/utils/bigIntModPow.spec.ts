import { bigIntModPow } from "./bigIntModPow";

describe("bigint mod and pow", () => {
  it.each([
    { b: 0n, e: 3n, m: 13n, r: 0n },
    { b: 5n, e: 3n, m: 13n, r: 8n },
    { b: -5n, e: 3n, m: 13n, r: 5n },
    { b: 5n, e: -3n, m: 13n, r: 5n },
    { b: -5n, e: -3n, m: 13n, r: 8n },
    { b: 5n, e: 3n, m: 4n, r: 1n },
    { b: -5n, e: 3n, m: 4n, r: 3n },
  ])("should $b ^ $e % $m = $r", ({ b, e, m, r }) => {
    expect(bigIntModPow(b, e, m)).toEqual(r);
  });
});
