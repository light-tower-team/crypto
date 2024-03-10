export class InvalidClientPublicEphemeralError extends Error {
  public constructor() {
    super("The client sent an invalid public ephemeral.");
  }
}

export class InvalidServerPublicEphemeralError extends Error {
  public constructor() {
    super("The server sent an invalid public ephemeral.");
  }
}

export class InvalidClientSessionProofError extends Error {
  public constructor() {
    super("Client provided session proof is invalid.");
  }
}

export class InvalidServerSessionProofError extends Error {
  public constructor() {
    super("Server provided session proof is invalid.");
  }
}
