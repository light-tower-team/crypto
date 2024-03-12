import { IncorrectArgTypeError } from "./digest";
import { sha256 } from "./sha256";
import { sha384 } from "./sha384";
import { sha512 } from "./sha512";

const HASHING_ALGORITHMS = {
  "SHA-256": sha256,
  "SHA-384": sha384,
  "SHA-512": sha512,
} as const;

describe("hashing", () => {
  it.each`
    algorithm    | input                           | output
    ${"SHA-256"} | ${"dsad4598d4wd6as"}            | ${"48fc795178a658e924a18ffe4642d17cfa62be266979c1dbab8128aafd1dfe21"}
    ${"SHA-384"} | ${"34mf9320fh32r329j9f203fjff"} | ${"5e7b7d8c8f1fc5c87bb7245f41e7ede88f656427f4559d8aef4304c5d4a15bc066058017ab5af661cb2b1ca92ec78514"}
    ${"SHA-512"} | ${"adqdwqdw"}                   | ${"1cf1010e2dc75c7834e38da9d163d9de74310c1a1f8e1c6156d7341de51bf793311029d2bf34d846b1ed5bd2a0abcb35f6239acd83345ceb210fb6170b0f018d"}
  `(
    "should perform hashing through $algorithm",
    ({ algorithm, input, output }: { algorithm: keyof typeof HASHING_ALGORITHMS; input: string; output: string }) => {
      expect(HASHING_ALGORITHMS[algorithm](input)).resolves.toEqual(output);
    },
  );

  it.each`
    algorithm    | input
    ${"SHA-256"} | ${{ a: "b" }}
    ${"SHA-384"} | ${false}
    ${"SHA-512"} | ${undefined}
    ${"SHA-512"} | ${Symbol("a")}
  `(
    "should throw an error with '$input' input value",
    ({ algorithm, input }: { algorithm: keyof typeof HASHING_ALGORITHMS; input: any }) => {
      expect(HASHING_ALGORITHMS[algorithm](input)).rejects.toThrowError(IncorrectArgTypeError);
    },
  );
});
