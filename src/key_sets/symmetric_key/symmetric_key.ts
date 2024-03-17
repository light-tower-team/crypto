import { JsonWebEncryption, base64ToBuf, bufToBase64, generateCryptoRandomValues } from "../../common";
import { JsonWebEncryptionLike } from "../../common/jwe/types";

export function generateKey(): ArrayBuffer {
  return generateCryptoRandomValues(32);
}

export function encryptByAUK(symKey: ArrayBuffer, auk: ArrayBuffer): Promise<string> {
  return new JsonWebEncryption()
    .setKeyEncryptionAlgorithm("PBES2-HS256+A128KW")
    .setContentEncryptionAlgorithm("A256GCM")
    .encrypt(auk, bufToBase64(symKey));
}

export async function decryptByAUK(jwe: JsonWebEncryptionLike, auk: ArrayBuffer): Promise<ArrayBuffer> {
  return JsonWebEncryption.decrypt(jwe, auk).then(base64ToBuf);
}
