import { NIL } from "./groups";
import { hexToBigInt, HashFunction, HashFunctionArgs } from "../common";

export interface SRPInstanceOptions {
  hash: HashFunction;
}

export abstract class SRPInstance {
  protected publicEphemeral: bigint = NIL;
  protected privateEphemeral: bigint = NIL;

  public constructor(protected readonly options: SRPInstanceOptions) {}

  protected H = async (...args: HashFunctionArgs): Promise<bigint> => {
    return this.options.hash(...args).then(hexToBigInt);
  };
}
