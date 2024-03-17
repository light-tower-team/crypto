import { AUK } from ".";

describe("account unlock key", () => {
  it("should normalize a password", () => {
    const password = "9QRPezxOiO6SfUi";

    expect(AUK.deriveKey(`  ${password}    `)).toEqual(
      new Uint8Array([57, 81, 82, 80, 101, 122, 120, 79, 105, 79, 54, 83, 102, 85, 105]).buffer,
    );
  });
});
