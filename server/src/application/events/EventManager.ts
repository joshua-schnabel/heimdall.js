import EventListener, { symbol as ELSymbol } from "@domain/types/EventListener";
import { injectAll, injectable } from "@autoload/tsyringe";
import Event from "@domain/types/Event";
import log from "@application/logging/logger";

@injectable()
export default class EventManager {
    private readonly listeners = new Map();

    public constructor (@injectAll(ELSymbol) listeners: EventListener<Event>[]) {
      log.info("Found %d Eventlisteners", listeners.length);
      listeners.forEach((listener: EventListener<Event>) => {
        const events: Function[] = Reflect.getMetadata("events:acceptance", listener, "consumeEvent");
        events.forEach((event) => {
          const eventName = event.name;
          log.info("Register %s for Event %s.", listener.constructor.name, eventName);
          if (this.listeners.has(eventName)) {
            const value: unknown[] = this.listeners.get(eventName);
            value.push(listener);
            this.listeners.set(eventName, value);
          } else {
            this.listeners.set(eventName, [listener]);
          }
        });
      });
    }

    public async publishEvent (event: Event, exclude?: string): Promise<void> {
      const eventName = event.constructor.name;
      const listeners: EventListener<Event>[] = this.listeners.get(eventName);
      const promises: Promise<void>[] = [];
      listeners.forEach((l) => {
        if (exclude !== undefined) {
          if (l.constructor.name !== exclude) {
            promises.push(l.consumeEvent(event));
          }
        } else {
          promises.push(l.consumeEvent(event));
        }
      });
      return new Promise<void>((resolve, reject) => {
        Promise.allSettled(promises)
          .then(() => {
            resolve();
          }).catch((err) => {
            log.error("Error while processing Event: %s", err);
            reject(err);
          });
      });
    }
}
