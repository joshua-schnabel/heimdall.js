
import promclient, { Registry } from "prom-client";
import PrometheusPlugin from "../PrometheusPlugin";

export default class PrometheusHttpStats implements PrometheusPlugin {
  private counter: promclient.Counter<string>;
  private histogram: promclient.Histogram<"method" | "statusCode">;
  public start (): void {}

  public setupCounter (registry: Registry): void {
    this.counter = new promclient.Counter({
      name: "requests_count",
      help: "Request Count",
      registers: [registry]
    });
    this.histogram = new promclient.Histogram({
      name: "requests",
      help: "Requests",
      labelNames: ["method", "statusCode"],
      registers: [registry],
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      buckets: [1, 10, 30, 90, 270, 810, 1215]
    });
  }

  public newRequest (): void {
    this.counter.inc();
  }

  public request (methode: string, statuscode: number, duration: number): void {
    this.histogram.labels(methode, statuscode.toString()).observe(duration);
  }
}
