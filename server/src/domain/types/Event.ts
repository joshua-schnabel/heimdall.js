// import { v5 as uuidv5 } from "uuid";

export default abstract class Event {
    private readonly namespace: string = "1b671a64-40d5-491e-99b0-da01ff1f3341";

    private readonly id: string;
    private readonly timestamp: number;

    public constructor () {
      this.id = "";
      this.timestamp = new Date().getTime();
    }

    public getId (): string {
      return this.id;
    }

    public getTimestamp (): number {
      return this.timestamp;
    }

    abstract getEventName (): string;
}
