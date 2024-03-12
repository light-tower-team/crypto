import { faker } from "@faker-js/faker";
import { SRPClient } from "./client";
import { G_2048 } from "./groups";
import { sha256, generateCryptoRandomString } from "../common";
import { SRPServer } from "./server";

test("srp", async () => {
  const client = new SRPClient(G_2048, { hash: sha256 });

  const username = faker.internet.userName();
  const password = faker.internet.password();
  const salt = generateCryptoRandomString();

  const privateKey = await sha256(salt, await sha256(`${username}:${password}`));

  const verifier = client.deriveVerifier(privateKey);

  const clientPublicEphemeral = client.generatePublicEphemeral();

  const server = new SRPServer(G_2048, { hash: sha256 }, verifier);

  const serverPublicEphemeral = await server.generatePublicEphemeral();

  const clientSession = await client.deriveSession(serverPublicEphemeral, privateKey, username, salt);

  const serverSession = await server.deriveSession(clientPublicEphemeral, clientSession.proof, username, salt);

  expect(client.verifySession(clientSession, serverSession.proof)).resolves.toBeUndefined();
});
