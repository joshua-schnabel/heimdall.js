/* eslint-disable @typescript-eslint/require-await */
import routingControllers from "routing-controllers"; import { injectable, container } from "@autoload/tsyringe";
import HttpRoute from "@infrastructure/express/interfaces/HttpControler.interface";
import { Request } from "express";
import HttpStatus from "http-status-codes";
import { log } from "@logger";
import MessageRepository, { symbol as MRSymbol } from "@domain/message/MessageRepository";
import HttpException from "@infrastructure/express/exceptions/HttpException";
import MulterMiddleware from "@infrastructure/express/middlewares/multer.middleware";
import { UseBefore } from "@infrastructure/express/middlewares/middleware";
import { AcceptContentType, testContentType } from "@infrastructure/express/AcceptContentTypeDecorator";
import Message from "@domain/message/Message"; import EventManager from "@application/events/EventManager";
import NewMessageEvent from "@domain/event/NewMessageEvent";

const { Get, Req, JsonController, Put, Authorized, Body } = routingControllers;

@injectable()
@JsonController("/api/v1/mqtt")
export default class MqttApiController implements HttpRoute {
  private readonly messageRepository: MessageRepository;
  private readonly eventManager: EventManager;

  public constructor () {
    this.messageRepository = container.resolve(MRSymbol);
    this.eventManager = container.resolve(EventManager);
  }

  @Get(/\/.*/)
  @Authorized("MQTT_READ")
  public async get (@Req() request: Request): Promise<object> {
    const topic = this.getMqttPath(request.path);
    if (topic === "") {
      throw new HttpException(HttpStatus.BAD_REQUEST, "Topic can't be empty!");
    }
    log("http").debug("Get Message from topic '%s'", topic);
    const messages = await this.messageRepository.getAll(topic);
    if (messages.length === 1) {
      return messages[0];
    } else if (messages.length === 0) {
      throw new HttpException(HttpStatus.NOT_FOUND, "No MQTT Message found at this topic!");
    } else {
      return messages;
    }
  }

  @Put(/\/.*/)
  @Authorized("MQTT_WRITE")
  @AcceptContentType(["application/json"])
  @UseBefore(MulterMiddleware)
  public async put (@Req() request: Request, @Body() message: object): Promise<object> {
    testContentType(this, request);
    const topic = this.getMqttPath(request.path);
    await this.eventManager.publishEvent(
      new NewMessageEvent(new Message(topic, JSON.stringify(message)))
    );
    return { message: "Message published at '" + topic + "'" };
  }

  private getMqttPath (path: string): string {
    return path.replace("/api/v1/mqtt/", "");
  }
}
