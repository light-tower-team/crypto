import { faker } from "@faker-js/faker";
import { IncorrectOriginCryptoKeyError } from "./errors";
import { RSA } from ".";
import { generateKeyPair } from "./__tests__/helpers/generate_key_pair";
import { checkAsymmetricEncryption } from "./__tests__/helpers/check_asymmetric_encryption";

describe("rsa", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should encrypt and decrypt data", async () => {
    const TEST_TEXT = faker.string.alpha(10);
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const ciphertext = await publicKey.encrypt(TEST_TEXT);

    expect(privateKey.decrypt(ciphertext)).resolves.toEqual(TEST_TEXT);
  });

  it("should throw an error when public key is incorrect", async () => {
    const TEST_INCORRECT_PUBLIC_KEY = { algorithm: { name: "AES" }, type: "secret" } as CryptoKey;
    const TEST_PRIVATE_KEY = await generateKeyPair().then(({ privateKey }) => privateKey);

    const generateKey = vi.spyOn(crypto.subtle, "generateKey").mockResolvedValueOnce({
      publicKey: TEST_INCORRECT_PUBLIC_KEY,
      privateKey: TEST_PRIVATE_KEY,
    });

    expect(RSA.generateKeyPair()).rejects.toThrowError(IncorrectOriginCryptoKeyError);

    expect(generateKey).toHaveBeenCalledOnce();
  });

  it("should throw an error when private key is incorrect", async () => {
    const TEST_PUBLIC_KEY = await generateKeyPair().then(({ publicKey }) => publicKey);
    const TEST_INCORRECT_PRIVATE_KEY = { algorithm: { name: "AES" }, type: "secret" } as CryptoKey;

    const generateKey = vi.spyOn(crypto.subtle, "generateKey").mockResolvedValueOnce({
      publicKey: TEST_PUBLIC_KEY,
      privateKey: TEST_INCORRECT_PRIVATE_KEY,
    });

    expect(RSA.generateKeyPair()).rejects.toThrowError(IncorrectOriginCryptoKeyError);

    expect(generateKey).toHaveBeenCalledOnce();
  });

  it("should convert the public key to jwk format", async () => {
    const { publicKey } = await RSA.generateKeyPair();

    const jwk = await publicKey.toJWK();

    expect(jwk).toHaveProperty("kty", "RSA");
    expect(jwk).toHaveProperty("alg", "RSA-OAEP-256");
    expect(jwk).toHaveProperty("ext", true);
    expect(jwk).toHaveProperty("key_ops", ["encrypt"]);
  });

  it("should convert the private key to jwk format", async () => {
    const { privateKey } = await RSA.generateKeyPair();

    const jwk = await privateKey.toJWK();

    expect(jwk).toHaveProperty("kty", "RSA");
    expect(jwk).toHaveProperty("alg", "RSA-OAEP-256");
    expect(jwk).toHaveProperty("ext", true);
    expect(jwk).toHaveProperty("key_ops", ["decrypt"]);
  });

  it("should restore the public key from jwk", async () => {
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const jwk = await publicKey.toJWK();

    const decodedPublicKey = await RSA.PublicKey.fromJWK(jwk);

    expect(checkAsymmetricEncryption(decodedPublicKey, privateKey)).resolves.toBeTruthy();
  });

  it("should restore the private key from jwk", async () => {
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const jwk = await privateKey.toJWK();

    const decodedPrivateKey = await RSA.PrivateKey.fromJWK(jwk);

    expect(checkAsymmetricEncryption(publicKey, decodedPrivateKey)).resolves.toBeTruthy();
  });
});
