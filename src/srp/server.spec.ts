import { faker } from "@faker-js/faker";
import { generateCryptoRandomString, sha256 } from "../common";
import { SRPClient } from "./client";
import { G_2048, NIL } from "./groups";
import { InvalidClientPublicEphemeralError, InvalidClientSessionProofError } from "./errors";
import { SRPServer } from "./server";

describe("SRPServer", async () => {
  let salt: string;
  let username: string;
  let privateKey: string;

  beforeEach(async () => {
    username = faker.internet.userName();
    const password = faker.internet.password();

    salt = generateCryptoRandomString();
    privateKey = await sha256(salt, await sha256(`${username}:${password}`));
  });

  it("should throw an error if the client's public ephemeral is incorrect", async () => {
    const client = new SRPClient(G_2048, { hash: sha256 });

    const verifier = client.deriveVerifier(privateKey);

    const server = new SRPServer(G_2048, { hash: sha256 }, verifier);

    const serverPublicEphemeral = await server.generatePublicEphemeral();

    const clientSession = await client.deriveSession(serverPublicEphemeral, privateKey, username, salt);

    expect(server.deriveSession("00", clientSession.proof, username, salt)).rejects.toThrowError(
      InvalidClientPublicEphemeralError,
    );
  });

  it("should initialize the group", async () => {
    const client = new SRPClient(G_2048, { hash: sha256 });

    const verifier = client.deriveVerifier(privateKey);

    const clientPublicEphemeral = client.generatePublicEphemeral();

    const group = { ...G_2048, k: NIL };
    const server = new SRPServer(group, { hash: sha256 }, verifier);

    const serverPublicEphemeral = await server.generatePublicEphemeral();

    const clientSession = await client.deriveSession(serverPublicEphemeral, privateKey, username, salt);

    await server.deriveSession(clientPublicEphemeral, clientSession.proof, username, salt);

    expect(group.k).not.toEqual(NIL);
  });

  it("should throw an error when the client's session proof is incorrect", async () => {
    const client = new SRPClient(G_2048, { hash: sha256 });

    const verifier = client.deriveVerifier(privateKey);

    const clientPublicEphemeral = client.generatePublicEphemeral();

    const server = new SRPServer(G_2048, { hash: sha256 }, verifier);

    expect(server.deriveSession(clientPublicEphemeral, "00", username, salt)).rejects.toThrowError(
      InvalidClientSessionProofError,
    );
  });
});
