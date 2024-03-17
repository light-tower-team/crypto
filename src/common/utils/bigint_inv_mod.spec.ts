import { bigIntInvMod } from "./bigint_inv_mod";

describe("bigint inverse mod", () => {
  it.each([
    { b: 5n, m: 13n, r: 8n },
    { b: -5n, m: 13n, r: 5n },
  ])("should $b ^ -1 = $r (mod $m)", ({ b, m, r }) => {
    expect(bigIntInvMod(b, m)).toEqual(r);
  });
});
