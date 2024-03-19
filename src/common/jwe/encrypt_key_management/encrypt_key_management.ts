import { UnknownKeyEncryptionAlgorithmError } from "../errors";
import { generateCEK } from "../generate_cek/generate_cek";
import { pbes2kw } from "../pbes2_kw";
import { rsaoaep } from "../rsa_oaep";
import { ContentEncryptionAlgorithm, CryptoKeyLike, HeaderParams, KeyEncryptionAlgorithm } from "../types";

export async function encryptKeyManagement(
  alg: KeyEncryptionAlgorithm,
  enc: ContentEncryptionAlgorithm,
  key: CryptoKeyLike,
) {
  let cek: CryptoKeyLike;
  let encryptedKey: ArrayBuffer | undefined;
  let params: HeaderParams | undefined;

  switch (alg) {
    case "dir": {
      cek = key;
      break;
    }
    case "RSA-OAEP":
    case "RSA-OAEP-256": {
      cek = await generateCEK(enc);
      encryptedKey = await rsaoaep.encrypt(key, cek);
      break;
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      cek = await generateCEK(enc);
      ({ encryptedKey, ...params } = await pbes2kw.encrypt(alg, key, cek));
      break;
    }
    default: {
      throw new UnknownKeyEncryptionAlgorithmError();
    }
  }

  return { cek, encryptedKey, params };
}
