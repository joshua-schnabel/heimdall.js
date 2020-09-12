export type Topic = string;
export type Content = string;

export default class Message {
    private readonly topic: Topic;
    private readonly content: Content;

    public constructor (topic: Topic, content: Content) {
      this.content = content;
      this.topic = topic;
    }

    public getTopic (): Topic {
      return this.topic;
    }

    public getContent (): Content {
      return this.content;
    }
}
