export type PBES2Algorithm = {
  baseAlg: { name: string; hash: string };
  wrappingAlg: { name: string; length: number };
};
