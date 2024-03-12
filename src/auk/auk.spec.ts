import { faker } from "@faker-js/faker";
import { AUK } from ".";

describe("auk", () => {
  it("should derive an auk", async () => {
    const TEST_MASTER_PASSWORD = faker.string.alpha(10);

    const auk = await AUK.derive(TEST_MASTER_PASSWORD);

    expect(auk).toHaveProperty("type", "secret");
    expect(auk).toHaveProperty("algorithm", { name: "PBKDF2" });
    expect(auk).toHaveProperty("extractable", false);
    expect(auk).toHaveProperty("usages", ["deriveBits", "deriveKey"]);
  });
});
