import {
  EncryptedKeyNotSpecifiedError,
  InputIterationCountNotSpecifiedError,
  InputSaltNotSpecifiedError,
  UnknownKeyEncryptionAlgorithmError,
} from "../errors";
import { pbes2kw } from "../pbes2_kw";
import { rsaoaep } from "../rsa_oaep";
import { CryptoKeyLike, HeaderParams, KeyEncryptionAlgorithm } from "../types";

export async function decryptKeyManagement(
  alg: KeyEncryptionAlgorithm,
  key: CryptoKeyLike,
  encryptedKey: ArrayBuffer | undefined,
  params: HeaderParams | undefined,
) {
  switch (alg) {
    case "dir": {
      return key;
    }
    case "RSA-OAEP":
    case "RSA-OAEP-256": {
      if (!encryptedKey) {
        throw new EncryptedKeyNotSpecifiedError();
      }

      return rsaoaep.decrypt(key, encryptedKey);
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      if (!encryptedKey) {
        throw new EncryptedKeyNotSpecifiedError();
      }

      if (!params?.p2s) {
        throw new InputSaltNotSpecifiedError();
      }

      if (!params?.p2c) {
        throw new InputIterationCountNotSpecifiedError();
      }

      return pbes2kw.decrypt(alg, key, encryptedKey, params.p2s, params.p2c);
    }
    default: {
      throw new UnknownKeyEncryptionAlgorithmError();
    }
  }
}
