
import Event from "@domain/types/Event";
import Message from "@domain/message/Message";

export default class NewMessageEvent extends Event {
  private readonly message: Message;
  public constructor (message: Message) {
    super();
    this.message = message;
  }

  public getEventName (): string {
    return "NewMessageEvent";
  }

  public getMessage (): Message {
    return this.message;
  }
}
