import Event from "./Event";

export const symbol = Symbol.for("EventListener");

export default interface EventListener<T extends Event> {
    consumeEvent(event: T): Promise<void>;
}

export function Events (type: unknown[]): Function {
  return Reflect.metadata("events:acceptance", type);
}
