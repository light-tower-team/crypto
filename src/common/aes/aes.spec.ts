import { faker } from "@faker-js/faker";
import { AES } from "./aes";

describe("aes", () => {
  it("should encrypt and decrypt data", async () => {
    const TEST_TEXT = faker.string.alpha(10);
    const key = await AES.generateKey();

    const jwe = await key.encrypt(TEST_TEXT);

    expect(key.decrypt(jwe)).resolves.toEqual(TEST_TEXT);
  });
});
