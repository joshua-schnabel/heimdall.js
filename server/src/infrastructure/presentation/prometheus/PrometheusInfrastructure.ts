import { log } from "@application/logging/logger";
import { NewMessageEventListener } from "@domain/event/NewMessageEventListener";
import { Events } from "@domain/types/EventListener";
import NewMessageEvent from "@domain/event/NewMessageEvent";
import { injectable } from "@autoload/tsyringe";
import InfrastructureAdapter from "@application/interfaces/infrastructureAdapter.interface";
import promclient from "prom-client";
import PrometheusServiceStats from "./plugins/PrometheusServiceStats";
import PrometheusPlugin from "./PrometheusPlugin";
import PrometheusHttpStats from "./plugins/PrometheusHttpStats";
import PrometheusMqttStats from "./plugins/PrometheusMqttStats";

const LOG = log("prometheus");

let inf: PrometheusInfrastructure;

@injectable()
export default class PrometheusInfrastructure implements InfrastructureAdapter {
  private readonly plugins: Map<string, PrometheusPlugin>;
  private registry: promclient.Registry;

  public constructor () {
    this.plugins = new Map<string, PrometheusPlugin>();
    this.plugins.set("system", new PrometheusServiceStats());
    this.plugins.set("http", new PrometheusHttpStats());
    this.plugins.set("mqtt", new PrometheusMqttStats());
    inf = this;
  }

  public priority (): number {
    return 1;
  }

  public start (): void {
    LOG.info("Enabling Prometheus Metrics.");
    this.registry = new promclient.Registry();
    this.setupPlugins();
  }

  public getPlugin (name: string): PrometheusPlugin {
    return this.plugins.get(name);
  }

  public getMetrics (): string {
    return this.registry.metrics();
  }

  private setupPlugins (): void {
    this.plugins.forEach((value: PrometheusPlugin, _key: string) => {
      value.setupCounter(this.registry);
      value.start();
    });
  }
}

@injectable()
export class PrometheusMetricsAdapter {
  public get (): PrometheusInfrastructure {
    return inf;
  }
}

@injectable()
export class PrometheusEventListener implements NewMessageEventListener {
  @Events([NewMessageEvent])
  public async consumeEvent (event: NewMessageEvent): Promise<void> {
    return (<PrometheusMqttStats> inf.getPlugin("mqtt")).updateStats(event);
  }
}

