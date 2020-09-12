import Message, { Topic } from "./Message";

export default interface MessageRepository {
    store(message: Message): Promise<Message>;
    get(topic: Topic): Promise<Message>;
    getAll(topic: Topic): Promise<Message[]>;
}

export const symbol = Symbol.for("MessageRepository");

