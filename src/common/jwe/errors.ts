export class EncryptedKeyNotSpecifiedError extends Error {
  public constructor() {
    super("The encrypted key is not specified.");
  }
}

export class KeyEncryptionAlgorithmNotSpecifiedError extends Error {
  public constructor() {
    super("The key encryption algorithm is not specified.");
  }
}

export class ContentEncryptionAlgorithmNotSpecifiedError extends Error {
  public constructor() {
    super("The content encryption algorithm is not specified.");
  }
}

export class InputSaltNotSpecifiedError extends Error {
  public constructor() {
    super("The p2s is not specified..");
  }
}

export class InputIterationCountNotSpecifiedError extends Error {
  public constructor() {
    super("The p2s is not specified..");
  }
}

export class UnknownKeyEncryptionAlgorithmError extends Error {
  public constructor() {
    super("Unknown key encryption algorithm.");
  }
}
export class UnknownContentEncryptionAlgorithmError extends Error {
  public constructor() {
    super("Unknown content encryption algorithm.");
  }
}

export class UnknownSerializationError extends Error {
  public constructor() {
    super("Unknown serialization.");
  }
}
