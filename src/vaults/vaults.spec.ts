import { faker } from "@faker-js/faker";
import { RSA, generateCryptoRandomValues } from "../common";
import Vaults, { Vault } from ".";

describe("vaults", () => {
  it("should encrypt/decrypt a vault by public/private keys", async () => {
    const { publicKey, privateKey } = await RSA.generateKeyPair();

    const vault: Vault = {
      key: generateCryptoRandomValues(32),
      overview: { name: faker.string.alpha(), desc: faker.string.alpha() },
    };

    const encVault = await Vaults.encryptByPublicKey(vault, publicKey);

    expect(Vaults.decryptByPrivateKey(encVault, privateKey)).resolves.toEqual(vault);
  });

  it("should encrypt/decrypt a vault by a symmetric key", async () => {
    const symKey = generateCryptoRandomValues(32);

    const vault: Vault = {
      key: generateCryptoRandomValues(32),
      overview: { name: faker.string.alpha(), desc: faker.string.alpha() },
    };

    const encVault = await Vaults.encryptBySymKey(vault, symKey);

    expect(Vaults.decryptBySymKey(encVault, symKey)).resolves.toEqual(vault);
  });
});
