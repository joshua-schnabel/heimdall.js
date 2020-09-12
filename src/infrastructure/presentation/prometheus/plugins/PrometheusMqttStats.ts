
import promclient, { Registry } from "prom-client";
import PrometheusPlugin from "../PrometheusPlugin";
import NewMessageEvent from "@domain/event/NewMessageEvent";

export default class PrometheusMqttStats implements PrometheusPlugin {
    private upTimeGauge: promclient.Gauge<string>;
    private clientsConnected: promclient.Gauge<string>;
    private clientsActive: promclient.Gauge<string>;
    private storedMsgCount: promclient.Gauge<string>;
    private retainedMsgCount: promclient.Gauge<string>;
    private sentMsgCount: promclient.Gauge<string>;
    private recievedMsgCount: promclient.Gauge<string>;

    public start (): void {}

    public setupCounter (registry: Registry): void {
      this.upTimeGauge = new promclient.Gauge({
        name: "mqttupTimeCounter",
        help: "MQTT Uptime",
        registers: [registry]
      });
      this.clientsConnected = new promclient.Gauge({
        name: "mqttupClientsConnected",
        help: "Mqtt connected clients",
        registers: [registry]
      });
      this.clientsActive = new promclient.Gauge({
        name: "mqttupClientsActive",
        help: "Mqtt active clients",
        registers: [registry]
      });
      this.storedMsgCount = new promclient.Gauge({
        name: "mqttupStoredMsgCount",
        help: "Mqtt stored messages",
        registers: [registry]
      });
      this.retainedMsgCount = new promclient.Gauge({
        name: "mqttRetainedMsgCount",
        help: "Mqtt retained messages",
        registers: [registry]
      });
      this.sentMsgCount = new promclient.Gauge({
        name: "mqttSentMsgCount",
        help: "Mqtt sent messages",
        registers: [registry]
      });
      this.recievedMsgCount = new promclient.Gauge({
        name: "mqttRecievedMsgCount",
        help: "Mqtt recieved messages",
        registers: [registry]
      });
    }

    public async updateStats (event: NewMessageEvent): Promise<void> {
      return new Promise((resolve) => {
        const topic = event.getMessage().getTopic();
        if (topic.startsWith("$SYS/")) {
          if (topic === "$SYS/broker/uptime") {
            this.upTimeGauge.set(parseInt(event.getMessage().getContent().split(" ")[0]));
          } else if (topic === "$SYS/broker/clients/active") {
            this.clientsActive.set(parseInt(event.getMessage().getContent()));
          } else if (topic === "$SYS/broker/clients/connected") {
            this.clientsConnected.set(parseInt(event.getMessage().getContent()));
          } else if (topic === "$SYS/broker/store/messages/count") {
            this.storedMsgCount.set(parseInt(event.getMessage().getContent()));
          } else if (topic === "$SYS/broker/publish/messages/sent") {
            this.sentMsgCount.set(parseInt(event.getMessage().getContent()));
          } else if (topic === "$SYS/broker/publish/messages/received") {
            this.recievedMsgCount.set(parseInt(event.getMessage().getContent()));
          } else if (topic === "$SYS/broker/retained messages/count") {
            this.retainedMsgCount.set(parseInt(event.getMessage().getContent()));
          }
        }
        resolve();
      });
    }
}
