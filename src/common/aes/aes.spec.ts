import { faker } from "@faker-js/faker";
import { AES } from "./aes";
import { IncorrectOriginCryptoKeyError, UnknownEncryptionAlgorithmError } from "../errors";
import { AESEncryptionAlgorithm } from "../jwe";

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

  it.each`
    enc
    ${"A128GCM"}
    ${"A192GCM"}
    ${"A256GCM"}
  `("should have correct jwe with $enc encryption algorithm ", async ({ enc }: { enc: AESEncryptionAlgorithm }) => {
    const TEST_TEXT = faker.string.alpha(10);
    const key = await AES.generateKey(enc);

    const jwe = await key.encrypt(TEST_TEXT);

    expect(jwe).toHaveProperty("enc", enc);
    expect(jwe).toHaveProperty("cty", "jwk+json");
    expect(jwe).toHaveProperty("iv");
    expect(jwe).toHaveProperty("tag");
    expect(jwe).toHaveProperty("ciphertext");
  });

  it("should throw an error when aes key is incorrect", async () => {
    const generateKey = vi
      .spyOn(crypto.subtle, "generateKey")
      .mockResolvedValueOnce({ algorithm: { name: "RSA-OAEP" }, type: "public" } as CryptoKey);

    expect(AES.generateKey()).rejects.toThrowError(IncorrectOriginCryptoKeyError);

    expect(generateKey).toHaveBeenCalledOnce();
  });

  it("should throw an error when aes encryption algorithm is unknown", async () => {
    const generateKey = vi.spyOn(crypto.subtle, "generateKey").mockResolvedValueOnce({
      algorithm: { name: "AES-OAEP", length: -1 },
      type: "secret",
      extractable: false,
      usages: [],
    } as CryptoKey);

    const key = await AES.generateKey();

    expect(() => key.enc).toThrowError(UnknownEncryptionAlgorithmError);

    expect(generateKey).toHaveBeenCalledOnce();
  });
});
