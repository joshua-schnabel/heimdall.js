
interface InfrastructureAdapter {
  start(): void;
}

export const symbol = Symbol.for("InfrastructureAdapter");

export default InfrastructureAdapter;
