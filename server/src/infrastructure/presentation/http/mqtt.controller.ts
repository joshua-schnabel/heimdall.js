/* eslint-disable @typescript-eslint/require-await */
import routingControllers from "routing-controllers";
import { injectable } from "@autoload/tsyringe";
import HttpRoute from "@infrastructure/express/interfaces/HttpControler.interface";
import { Request, Response } from "express";
import MessageRepository, { symbol as MRSymbol } from "@domain/message/MessageRepository";
import HttpStatus from "http-status-codes";
import container from "@autoload/types.config";

const { Get, Res, Req, JsonController, Put } = routingControllers;

@injectable()
@JsonController("/api/v1/mqtt")
export default class MqttApiController implements HttpRoute {
  private readonly messageRepository: MessageRepository;

  @Get(/\/.*/)
  public async get (@Req() request: Request, @Res() response: Response): Promise<object> {
    console.log(container.isRegistered(MRSymbol));
    const messages = await this.messageRepository.getAll(this.getMqttPath(request.path));
    if (messages.length === 1) {
      return messages[0];
    } else if (messages.length === 0) {
      response.status(HttpStatus.NOT_FOUND);
    } else {
      return messages;
    }
  }

  @Put(/\/.*/)
  public async put (@Req() request: Request, @Res() response: Response): Promise<string> {
    return "You called put Path " + this.getMqttPath(request.path);
  }

  private getMqttPath (path: string): string {
    return path.replace("/api/v1/mqtt", "");
  }
}
