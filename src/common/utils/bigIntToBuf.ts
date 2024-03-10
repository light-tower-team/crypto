import { bigIntToHex } from "./bigIntToHex";
import { hexToBuf } from "./hexToBuf";

export function bigIntToBuf(a: bigint): ArrayBuffer {
  return hexToBuf(bigIntToHex(a));
}
