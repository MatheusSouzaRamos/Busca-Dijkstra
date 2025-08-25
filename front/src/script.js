import { StringError, ServiceError } from "./errorHandling.js";

const services = new Map();
globalThis.logger = new Map();

const register = (name, service) => {
  if (typeof name !== "string") throw new StringError(name + " - register");

  name = name.toLowerCase();

  if (services.has(name))
    throw new ServiceError("service already registered: " + name);

  services.set(name, service);
  name = name + ": register";
  globalThis.logger.set(name, { status: "sucess", timestamp: new Date() });
};

const execute = (name, ...args) => {
  if (typeof name !== "string") throw new StringError(name + " - execute");

  name = name.toLowerCase();

  if (!services.has(name))
    throw new ServiceError("service not registered: " + name);

  services.get(name)(...args);
  name = name + ": execute";
  globalThis.logger.set(name, { status: "sucess", timestamp: new Date() });
};

const returnAllServices = () => {
  return services;
};

const returnLogger = () => {
  return globalThis.logger;
};

try {
  register(123, () => {
    console.log("sla");
  });
} catch (error) {
  switch (error.name) {
    case "StringError":
      console.log("Erro de string:", error.message);
      break;
    case "ServiceError":
      console.log("Erro de serviço:", error.message);
      break;
    default:
      console.log("Erro desconhecido:", error.message);
  }
}
