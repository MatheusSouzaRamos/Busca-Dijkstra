export class StringError extends Error {
  constructor(message) {
    super("name not string. Error at: " + message);
    this.name = "StringError";
  }
}

export class ServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServiceError";
  }
}

export default {
  StringError,
  ServiceError,
};
