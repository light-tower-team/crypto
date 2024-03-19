export class CryptoKeyRequiredError extends Error {
  public constructor() {
    super("The key must be a crypto key.");
  }
}
