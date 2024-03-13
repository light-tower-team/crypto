export class IncorrectOriginCryptoKeyError extends Error {
  public constructor() {
    super("Incorrect the origin crypto key.");
  }
}

export class UnknownEncryptionAlgorithmError extends Error {
  public constructor() {
    super("Unknown encryption algorithm.");
  }
}
