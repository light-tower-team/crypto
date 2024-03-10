import { Group, NIL } from "./groups";
import { generateCryptoRandomBigInt, bigIntToHex, bigIntModPow, hexToBigInt } from "../common";
import { InvalidClientPublicEphemeralError, InvalidClientSessionProofError } from "./errors";
import { SRPInstance, SRPInstanceOptions } from "./instance";

export class SRPServer extends SRPInstance {
  private readonly verifier: bigint;

  public constructor(
    private readonly group: Group,
    options: SRPInstanceOptions,
    verifier: string,
  ) {
    super(options);

    this.verifier = hexToBigInt(verifier);
  }

  public generatePublicEphemeral = async (): Promise<string> => {
    const b = generateCryptoRandomBigInt();

    const { H } = this;
    const { g, N } = this.group;
    const v = this.verifier;

    if (this.group.k === NIL) {
      this.group.k = await H(N, g);
    }

    const { k } = this.group;

    // B = k*v + g^b % N
    const B = k * v + bigIntModPow(g, b, N);

    this.publicEphemeral = B;
    this.privateEphemeral = b;

    return bigIntToHex(B);
  };

  public deriveSession = async (
    clientPublicEphemeral: string,
    clientSessionProof: string,
    username: string,
    salt: string,
  ) => {
    const { g, N } = this.group;

    const A = hexToBigInt(clientPublicEphemeral);

    if (A % N === NIL) {
      throw new InvalidClientPublicEphemeralError();
    }

    const { H } = this;

    const B = this.publicEphemeral;
    const b = this.privateEphemeral;
    const v = this.verifier;
    const u = await H(A, B);
    const s = hexToBigInt(salt);
    const I = username;

    // S = (A * v^u) ^ b % N
    const S = bigIntModPow(A * (bigIntModPow(v, u, N) % N), b, N);

    const K = await H(S);

    const M = await H((await H(N)) ^ (await H(g)), await H(I), s, A, B, K);

    const expected = M;
    const actual = hexToBigInt(clientSessionProof);

    if (actual !== expected) {
      throw new InvalidClientSessionProofError();
    }

    const P = await H(A, M, K);

    return {
      key: bigIntToHex(K),
      proof: bigIntToHex(P),
    };
  };
}
