import { base64ToBuf } from "./base64_to_buf";
import { bufToText } from "./buf_to_text";

export function base64ToText(b64: string): string {
  return bufToText(base64ToBuf(b64));
}
