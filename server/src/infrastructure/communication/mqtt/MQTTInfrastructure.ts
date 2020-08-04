import InfrastructureAdapter from "@application/interfaces/infrastructureAdapter.interface";
import { injectable, inject } from "@autoload/tsyringe";
import MQTT, { Packet } from "async-mqtt";
import { log } from "@application/logging/logger";
import CONF from "@application/configuration/config";
import EventManager from "@application/events/EventManager";
import NewMessageEvent from "@domain/event/NewMessageEvent";
import Message from "@domain/message/Message";

const LOG = log("mqtt");

@injectable()
export default class MQTTInfrastructure implements InfrastructureAdapter {
  private client: MQTT.AsyncMqttClient;
  private readonly adress: string;
  private readonly user: string;
  private readonly password: string;
  private readonly eventManager: EventManager;

  public constructor (@inject(EventManager) eventManager: EventManager) {
    this.adress = <string> CONF.getValue("mqtt.adress");
    this.user = <string> CONF.getValue("mqtt.user");
    this.password = <string> CONF.getValue("mqtt.password");
    this.eventManager = eventManager;
  }

  public start (): void {
    LOG.info("Connect to MQTT server %s", this.adress);
    MQTT.connectAsync(this.adress, { username: this.user, password: this.password }, false).then((client) => {
      LOG.info("Sucessfully connected to MQTT server");
      this.client = client;
      this.subscribe().then(() => {
        LOG.debug("Sucessfully subscripted to MQTT server");
      }).catch((err) => {
        LOG.error("Error while subscriping at MQTT server: %s", err);
      });
    }).catch((err: Error) => {
      LOG.error("Error while connecting to MQTT server: %s", err.message);
    });
  }

  private async subscribe (): Promise<void> {
    await this.client.subscribe("#");
    await this.client.subscribe("$SYS/#");
    this.client.on("message", (topic: string, payload: Buffer, _packet: Packet) => {
      LOG.debug("Message on topic %s", topic);
      this.processMessage(topic, payload).catch((err) => {
        LOG.error("Error while processing MQTT message: %s", err);
      });
    });
  }

  private async processMessage (topic: string, payload: Buffer): Promise<void> {
    return this.eventManager.publishEvent(new NewMessageEvent(new Message(topic, payload.toString())));
  }
}
