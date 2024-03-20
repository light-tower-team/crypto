import { faker } from "@faker-js/faker";
import { generateCryptoRandomString, sha256 } from "../common";
import { SRPClient } from "./client";
import { InvalidServerPublicEphemeralError, InvalidServerSessionProofError } from "./errors";
import { G_2048, NIL } from "./groups";
import { SRPServer } from "./server";

describe("SRPClient", async () => {
  let salt: string;
  let username: string;
  let privateKey: string;

  beforeEach(async () => {
    username = faker.internet.userName();
    const password = faker.internet.password();

    salt = generateCryptoRandomString();
    privateKey = await sha256(salt, await sha256(`${username}:${password}`));
  });

  it("should throw an error if the server's public ephemeral is incorrect", async () => {
    const client = new SRPClient(G_2048, { hash: sha256 });

    expect(client.deriveSession("00", privateKey, username, salt)).rejects.toThrowError(
      InvalidServerPublicEphemeralError,
    );
  });

  it("should initialize the group", async () => {
    const group = { ...G_2048, k: NIL };
    const client = new SRPClient(group, { hash: sha256 });

    const verifier = client.deriveVerifier(privateKey);

    const server = new SRPServer(G_2048, { hash: sha256 }, verifier);

    const serverPublicEphemeral = await server.generatePublicEphemeral();

    await client.deriveSession(serverPublicEphemeral, privateKey, username, salt);

    expect(group.k).not.toEqual(NIL);
  });

  it("should throw an error when the server's session proof is incorrect", async () => {
    const client = new SRPClient(G_2048, { hash: sha256 });

    const verifier = client.deriveVerifier(privateKey);

    const server = new SRPServer(G_2048, { hash: sha256 }, verifier);

    const serverPublicEphemeral = await server.generatePublicEphemeral();

    const clientSession = await client.deriveSession(serverPublicEphemeral, privateKey, username, salt);

    expect(client.verifySession(clientSession, "00")).rejects.toThrowError(InvalidServerSessionProofError);
  });
});
