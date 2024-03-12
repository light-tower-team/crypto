import { faker } from "@faker-js/faker";
import { AES } from "./aes";
import { IncorrectOriginCryptoKeyError } from "../errors";

describe("aes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should encrypt and decrypt data", async () => {
    const TEST_TEXT = faker.string.alpha(10);
    const key = await AES.generateKey();

    const jwe = await key.encrypt(TEST_TEXT);

    expect(key.decrypt(jwe)).resolves.toEqual(TEST_TEXT);
  });

  it("should throw an error when aes key is incorrect", async () => {
    const generateKey = vi
      .spyOn(crypto.subtle, "generateKey")
      .mockResolvedValueOnce({ algorithm: { name: "RSA-OAEP" }, type: "public" } as CryptoKey);

    expect(AES.generateKey()).rejects.toThrowError(IncorrectOriginCryptoKeyError);

    expect(generateKey).toHaveBeenCalledOnce();
  });
});
