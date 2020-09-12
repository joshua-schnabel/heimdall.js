
import { inject, injectable } from "@autoload/tsyringe";
import MQTT, { Packet } from "async-mqtt";
import { log } from "@application/logging/logger";
import CONF from "@application/configuration/config";
import EventManager from "@application/events/EventManager";
import NewMessageEvent from "@domain/event/NewMessageEvent";
import Message from "@domain/message/Message";
import InfrastructureAdapter from "@application/interfaces/infrastructureAdapter.interface";
import { NewMessageEventListener } from "@domain/event/NewMessageEventListener";
import { Events } from "@domain/types/EventListener";

const LOG = log("mqtt");

let adapter: MQTTAdapter;

export class MQTTAdapter {
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

  public async publish (message: Message): Promise<void> {
    await this.client.publish(message.getTopic(), message.getContent());
  }

  public start (): void {
    LOG.info("Connect to MQTT server %s", this.adress);
    MQTT.connectAsync(this.adress, {
      username: this.user,
      password: this.password,
      clean: false,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
      reconnectPeriod: 1000,
      connectTimeout: 3000,
      resubscribe: true
    }, false).then((client) => {
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
    this.client.on("message", (topic: string, payload: Buffer, _packet: Packet) => {
      LOG.debug("Message on topic %s", topic);
      this.processMessage(topic, payload).catch((err) => {
        LOG.error("Error while processing MQTT message: %s", err);
      });
    });
    await this.client.subscribe(["#", "$SYS/#"], { qos: 1, rap: true, rh: 1 });
  }

  private async processMessage (topic: string, payload: Buffer): Promise<void> {
    return this.eventManager.publishEvent(new NewMessageEvent(new Message(topic, payload.toString())), "MQTTEventListener");
  }
}

@injectable()
export default class MQTTInfrastructure implements InfrastructureAdapter {
  public constructor (@inject(EventManager) eventManager: EventManager) {
    adapter = new MQTTAdapter(eventManager);
  }

  public priority (): number {
    const prio = 20;
    return prio;
  }

  public start (): void {
    adapter.start();
  }
}

@injectable()
export class MQTTEventListener implements NewMessageEventListener {
  @Events([NewMessageEvent])
  public async consumeEvent (event: NewMessageEvent): Promise<void> {
    LOG.debug("Publish Message in: %s", event.getMessage().getTopic());
    await adapter.publish(event.getMessage());
  }
}
