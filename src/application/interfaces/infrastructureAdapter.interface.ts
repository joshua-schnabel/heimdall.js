
interface InfrastructureAdapter {
  start(): void;

  priority(): number;
}

export const symbol = Symbol.for("InfrastructureAdapter");

export default InfrastructureAdapter;
