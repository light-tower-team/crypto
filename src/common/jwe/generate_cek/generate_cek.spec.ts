import { UnknownContentEncryptionAlgorithmError } from "../errors";
import { generateCEK } from ".";
import { AES_GCM_ContentEncryptionAlgorithm } from "../types";

describe("generate cek", () => {
  it("should throw an error when the content encryption algorithm is unknown", () => {
    expect(generateCEK("AES" as AES_GCM_ContentEncryptionAlgorithm)).rejects.toThrowError(
      UnknownContentEncryptionAlgorithmError,
    );
  });
});
