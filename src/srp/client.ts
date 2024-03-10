import { NIL, Group } from "./groups";
import { generateCryptoRandomBigInt, bigIntToHex, bigIntModPow, hexToBigInt } from "../common";
import { InvalidServerPublicEphemeralError, InvalidServerSessionProofError } from "./errors";
import { SRPInstance, SRPInstanceOptions } from "./instance";

export class SRPClient extends SRPInstance {
  public constructor(
    private readonly group: Group,
    options: SRPInstanceOptions,
  ) {
    super(options);
  }

  public generatePublicEphemeral = (): string => {
    const a = generateCryptoRandomBigInt();

    const { g, N } = this.group;

    // A = g^a % N
    const A = bigIntModPow(g, a, N);

    this.publicEphemeral = A;
    this.privateEphemeral = a;

    return bigIntToHex(A);
  };

  public deriveVerifier = (privateKey: string): string => {
    const x = hexToBigInt(privateKey);

    const { g, N } = this.group;

    // v = g^x % N
    const v = bigIntModPow(g, x, N);

    return bigIntToHex(v);
  };

  public deriveSession = async (serverPublicEphemeral: string, privateKey: string, username: string, salt: string) => {
    const { g, N } = this.group;

    const B = hexToBigInt(serverPublicEphemeral);

    // B % N > 0
    if (B % N === NIL) {
      throw new InvalidServerPublicEphemeralError();
    }

    const { H } = this;

    const A = this.publicEphemeral;
    const a = this.privateEphemeral;
    const x = hexToBigInt(privateKey);
    const u = await H(A, B);
    const s = hexToBigInt(salt);
    const I = username;

    if (this.group.k === NIL) {
      this.group.k = await H(N, g);
    }

    const { k } = this.group;

    // S = (B - (k * g^x)) ^ (a + (u * x)) % N
    const S = bigIntModPow(B - k * (bigIntModPow(g, x, N) % N), a + u * x, N);

    const K = await H(S);

    const M = await H((await H(N)) ^ (await H(g)), await H(I), s, A, B, K);

    return {
      key: bigIntToHex(K),
      proof: bigIntToHex(M),
    };
  };

  public verifySession = async (session: any, serverSessionProof: string): Promise<void> => {
    const { H } = this;

    const A = this.publicEphemeral;
    const M = hexToBigInt(session.proof);
    const K = hexToBigInt(session.key);

    const expected = await H(A, M, K);
    const actual = hexToBigInt(serverSessionProof);

    if (actual !== expected) {
      throw new InvalidServerSessionProofError();
    }
  };
}
