import { UnknownContentEncryptionAlgorithmError } from "../errors";
import { AES_GCM_ContentEncryptionAlgorithm } from "../types";
import { generateCEK } from ".";

describe("generate cek", () => {
  it("should throw an error when the content encryption algorithm is unknown", () => {
    expect(generateCEK("AES" as AES_GCM_ContentEncryptionAlgorithm)).rejects.toThrowError(
      UnknownContentEncryptionAlgorithmError,
    );
  });
});
