import { NewMessageEventListener } from "@domain/event/NewMessageEventListener";
import MessageRepository, { symbol as MRSymbol } from "./MessageRepository";
import { inject, injectable } from "@autoload/tsyringe";
import NewMessageEvent from "@domain/event/NewMessageEvent";
import { Events } from "@domain/types/EventListener";
import log from "@application/logging/logger";

@injectable()
export default class MessagePersistor implements NewMessageEventListener {
    private readonly repository: MessageRepository;

    public constructor (@inject(MRSymbol) repository: MessageRepository) {
      this.repository = repository;
    }

    @Events([NewMessageEvent])
    public consumeEvent (event: NewMessageEvent): Promise<void> {
      if (event instanceof NewMessageEvent) {
        return new Promise((resolve, reject) => {
          this.repository.store(event.getMessage()).then((message) => {
            log.debug("Stored Message with topic %s", message.getTopic());
            resolve();
          }).catch((err: Error) => {
            log.error("Error while storing Message: %s", err.message);
            reject(err.message);
          });
        });
      }
    }
}
