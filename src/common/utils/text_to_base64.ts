import { bufToBase64 } from "./buf_to_base64";
import { textToBuf } from "./text_to_buf";

export function textToBase64(plaintext: string): string {
  return bufToBase64(textToBuf(plaintext));
}
