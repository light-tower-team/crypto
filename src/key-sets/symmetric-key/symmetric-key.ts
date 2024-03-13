import {
  AES,
  AESEncryptionAlgorithm,
  AES_ALGORITHMS,
  PBES2Encryption,
  base64ToBuf,
  bufToBase64,
  bufToText,
  concatBuffs,
  deriveCipherTextAndAuthTag,
  generateCryptoRandomValues,
  textToBuf,
} from "../../common";
import { BYTE } from "../../common/units";
import {
  AUTH_TAG_LENGTH,
  CURRENT_PBES2_ALGORITHM,
  INTERATION_COUNT,
  INITIALIZATION_VECTOR_LENGTH,
  PBES2_ALGORITHMS,
} from "./constants";

export function generate(enc?: AESEncryptionAlgorithm): Promise<AES> {
  return AES.generateKey(enc);
}

export async function encryptByAUK(symmetricKey: AES, auk: CryptoKey): Promise<PBES2Encryption> {
  const p2s = generateCryptoRandomValues();
  const p2c = INTERATION_COUNT;
  const alg = CURRENT_PBES2_ALGORITHM;
  const { baseAlg, wrappingAlg } = PBES2_ALGORITHMS[CURRENT_PBES2_ALGORITHM];

  const master = await crypto.subtle.deriveKey(
    {
      ...baseAlg,
      salt: p2s,
      iterations: p2c,
    },
    auk,
    wrappingAlg,
    true,
    ["wrapKey", "unwrapKey"],
  );

  const iv = generateCryptoRandomValues(INITIALIZATION_VECTOR_LENGTH);
  const tagLength = AUTH_TAG_LENGTH;

  const ciphertextAndAuthTag = await crypto.subtle.wrapKey("jwk", symmetricKey.origin, master, {
    ...master.algorithm,
    iv,
    tagLength,
  });

  const { ciphertext, tag } = deriveCipherTextAndAuthTag(ciphertextAndAuthTag, tagLength);

  return {
    enc: symmetricKey.enc,
    cty: "jwk+json",
    iv: bufToBase64(iv),
    tag: bufToBase64(tag),
    ciphertext: bufToBase64(ciphertext),
    alg,
    p2s: bufToBase64(p2s),
    p2c: bufToBase64(textToBuf(p2c.toString())),
  };
}

export async function decryptByAUK(jwe: PBES2Encryption, auk: CryptoKey): Promise<AES> {
  const { alg } = jwe;

  const p2s = base64ToBuf(jwe.p2s);
  const p2c = Number.parseInt(bufToText(base64ToBuf(jwe.p2c)));

  const { baseAlg, wrappingAlg } = PBES2_ALGORITHMS[alg];

  const master = await crypto.subtle.deriveKey(
    {
      ...baseAlg,
      salt: p2s,
      iterations: p2c,
    },
    auk,
    wrappingAlg,
    true,
    ["wrapKey", "unwrapKey"],
  );

  const iv = base64ToBuf(jwe.iv);
  const tag = base64ToBuf(jwe.tag);
  const ciphertext = base64ToBuf(jwe.ciphertext);
  const tagLength = tag.byteLength * BYTE;

  const origin = await crypto.subtle.unwrapKey(
    "jwk",
    concatBuffs(ciphertext, tag),
    master,
    {
      ...master.algorithm,
      iv,
      tagLength,
    },
    AES_ALGORITHMS[jwe.enc],
    true,
    ["wrapKey", "unwrapKey", "encrypt", "decrypt"],
  );

  return new AES(origin);
}
