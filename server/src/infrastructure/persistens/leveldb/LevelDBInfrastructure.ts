import InfrastructureAdapter from "@application/interfaces/infrastructureAdapter.interface";
import MessageRepository from "domain/message/MessageRepository";
import Message, { Content } from "@domain/message/Message";
import levelup, { LevelUp } from "levelup";
import memdown from "memdown";
import encodingDown from "encoding-down";
import jsonExtra from "json-extra";
import { log, Logger } from "@application/logging/logger";

const LOG: Logger = log("db");

const { isJsonString } = jsonExtra;

let db: LevelUp;

export class LevelDBRepository implements MessageRepository {
  public store (message: Message): Promise<Message> {
    return new Promise<Message>((resolve, reject) => {
      db.put(message.getTopic(), message.getContent(), function (err: Error) {
        if (err !== undefined) { reject(err); }
        LOG.debug("Stored message in " + message.getTopic());
        resolve(message);
      });
    });
  }

  public get (topic: string): Promise<Message> {
    return new Promise<Message>((resolve, reject) => {
      db.get(topic, function (err: Error, value: Content) {
        if (err !== undefined) { reject(err); }
        resolve(new Message(topic, value));
      });
    });
  }

  public getAll (topic: string): Promise<Message[]> {
    return new Promise<Message[]>((resolve, reject) => {
      const tTopic = topic.slice(0, -1);
      const values = db.createReadStream({ gte: tTopic + "!", lte: tTopic + "~" });
      const messages: Message[] = [];
      values.on("data", function (data: {key: string, value: string}) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (isJsonString(data.value)) {
          messages.push(new Message(data.key, JSON.parse(data.value)));
        } else {
          messages.push(new Message(data.key, data.value));
        }
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

export class LevelDBInfrastructure implements InfrastructureAdapter {
  public priority (): number {
    const prio = 17;
    return prio;
  }

  public start (): void {
    db = levelup(encodingDown(memdown()));
    LOG.info("Created in memory DB.");
  }
}
