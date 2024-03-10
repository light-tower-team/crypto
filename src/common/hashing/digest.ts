import { bigIntToBuf, textToBuf, bufToHex } from "../utils";
import { HashFunctionAlgorithm, HashFunctionArgs } from "./types";

export class IncorrectArgTypeError extends TypeError {
  public constructor() {
    super("Expected bigint or string.");
  }
}

/** @internal */
export async function digest(algorithm: HashFunctionAlgorithm, ...args: HashFunctionArgs): Promise<string> {
  const buffers: Uint8Array[] = [];

  for (const arg of args) {
    switch (typeof arg) {
      case "bigint": {
        buffers.push(new Uint8Array(bigIntToBuf(arg)));
        break;
      }
      case "string": {
        buffers.push(new Uint8Array(textToBuf(arg)));
        break;
      }
      default: {
        throw new IncorrectArgTypeError();
      }
    }
  }

  const buffer = new Uint8Array(buffers.reduce((length, buffer) => length + buffer.length, 0));

  let i = 0;

  for (const buf of buffers) {
    for (const byte of buf) {
      buffer[i++] = byte;
    }
  }

  return crypto.subtle.digest(algorithm, buffer).then(bufToHex);
}
