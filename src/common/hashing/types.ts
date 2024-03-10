export type HashFunctionAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

export type HashFunctionArgs = Array<string | bigint>;

export type HashFunction = (...args: HashFunctionArgs) => Promise<string>;
