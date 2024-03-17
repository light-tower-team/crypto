import { bigIntToHex } from "./bigint_to_hex";
import { hexToBuf } from "./hex_to_buf";

export function bigIntToBuf(a: bigint): ArrayBuffer {
  return hexToBuf(bigIntToHex(a));
}
