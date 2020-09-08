import cron, { ScheduledTask } from "node-cron";
import promclient, { Registry } from "prom-client";
import PrometheusPlugin from "../PrometheusPlugin";
import pidusage from "pidusage";
import { LOG } from "@application/logging/logger";

export default class PrometheusServiceStats implements PrometheusPlugin {
   private readonly job: ScheduledTask;
    private upTimeGauge: promclient.Gauge<string>;
    private cpuGauge: promclient.Gauge<string>;
    private memoryGauge: promclient.Gauge<string>;

    public constructor () {
      this.job = cron.schedule("*/5 * * * * *", () => {
        this.updateStats().then(() => {}).catch((err) => {
          LOG.error("Error while generating Service stats (%s)!", err);
        });
      });
    }

    public start (): void {
      this.job.start();
    }

    public setupCounter (registry: Registry): void {
      this.upTimeGauge = new promclient.Gauge({
        name: "upTimeCounter",
        help: "Uptime",
        registers: [registry]
      });
      this.cpuGauge = new promclient.Gauge({
        name: "cpuUsage",
        help: "CPU Usage in percent",
        registers: [registry]
      });
      this.memoryGauge = new promclient.Gauge({
        name: "memoryUsage",
        help: "memory Usgage in byte",
        registers: [registry]
      });
    }

    private async updateStats (): Promise<void> {
      this.upTimeGauge.set(Math.round(process.uptime()));
      const stats = await pidusage(process.pid);
      this.cpuGauge.set(stats.cpu);
      this.memoryGauge.set(stats.memory);
    }
}
