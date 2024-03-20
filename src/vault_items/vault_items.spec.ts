import { faker } from "@faker-js/faker";
import { generateCryptoRandomValues } from "../common";
import { VaultItem } from "./types";
import VaultItems from ".";

describe("vault items", () => {
  it("should encrypt/decrypt a vault item by a symmetric key", async () => {
    const vaultItem: VaultItem = {
      overview: { name: faker.string.alpha(), url: faker.internet.url() },
      details: { username: faker.internet.userName(), password: faker.internet.password() },
    };

    const symKey = generateCryptoRandomValues(32);

    const encVaultItem = await VaultItems.encryptBySymKey(vaultItem, symKey);

    expect(VaultItems.decryptBySymKey(encVaultItem, symKey)).resolves.toEqual(vaultItem);
  });
});
