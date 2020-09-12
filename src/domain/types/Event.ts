import CryptoJS from "crypto-js";

export default abstract class Event {
    private readonly id: string;
    private readonly timestamp: number;

    public constructor () {
      this.timestamp = new Date().getTime();
      this.id = CryptoJS.SHA256(this.timestamp + this.getEventName()).toString(CryptoJS.enc.Hex);
    }

    public getId (): string {
      return this.id;
    }

    public getTimestamp (): number {
      return this.timestamp;
    }

    abstract getEventName (): string;
}
