import MessageRepository from "domain/message/MessageRepository";
import Message, { Content } from "@domain/message/Message";
import levelup, { LevelUp } from "levelup";
import memdown from "memdown";
import encodingDown from "encoding-down";

export default class LevelDBRepository implements MessageRepository {
  private readonly db: LevelUp;

  public constructor () {
    this.db = levelup(encodingDown(memdown()));
  }

  public store (message: Message): Promise<Message> {
    return new Promise<Message>((resolve, reject) => {
      this.db.put(message.getTopic(), message.getContent(), function (err: Error) {
        if (err !== undefined) { reject(err); }
        resolve(message);
      });
    });
  }

  public get (topic: string): Promise<Message> {
    return new Promise<Message>((resolve, reject) => {
      this.db.get(topic, function (err: Error, value: Content) {
        if (err !== undefined) { reject(err); }
        resolve(new Message(topic, value));
      });
    });
  }

  public getAll (topic: string): Promise<Message[]> {
    return new Promise<Message[]>((resolve, reject) => {
      const tTopic = topic.slice(0, -1);
      const values = this.db.createReadStream({ gte: tTopic + "!", lte: tTopic + "~" });
      const messages: Message[] = [];
      values.on("data", function (data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        messages.push(new Message(data.key, data.value));
      });
      values.on("end", function () {
        resolve(messages);
      });
      values.on("error", function (err: Error) {
        reject(err);
      });
    });
  }
}
