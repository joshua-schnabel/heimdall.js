/* eslint-disable @typescript-eslint/require-await */
import routingControllers from "routing-controllers";
import { injectable } from "../../../autoload/tsyringe";
import HttpRoute from "../../express/interfaces/HttpControler.interface";
import { Request, Response } from "express";
import HttpException from "../../express/exceptions/HttpException";
import HttpStatus from "http-status-codes";

const { Controller, Get, Res, Req } = routingControllers;

@injectable()
@Controller()
export default class UserController implements HttpRoute {
  @Get("/")
  public async getAll (@Req() _request: Request, @Res() response: Response): Promise<string> {
    response.setHeader("X-ABC", "TEST");
    return "Hello World";
  }

 @Get("/error")
  public async getError (@Req() _request: Request, @Res() _response: Response): Promise<string> {
    throw new HttpException(HttpStatus.PAYMENT_REQUIRED, "A stupid error");
  }
}
