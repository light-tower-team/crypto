import { hexToBigInt, HashFunction, HashFunctionArgs } from "../common";
import { NIL } from "./groups";

export interface SRPInstanceOptions {
  hash: HashFunction;
}

export interface Session {
  proof: string;
  key: string;
}

export abstract class SRPInstance {
  protected publicEphemeral: bigint = NIL;
  protected privateEphemeral: bigint = NIL;

  public constructor(protected readonly options: SRPInstanceOptions) {}

  protected H = async (...args: HashFunctionArgs): Promise<bigint> => {
    return this.options.hash(...args).then(hexToBigInt);
  };
}
