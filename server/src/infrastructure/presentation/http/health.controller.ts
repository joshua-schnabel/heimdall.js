/* eslint-disable @typescript-eslint/require-await */
import routingControllers from "routing-controllers"; import { injectable } from "@autoload/tsyringe";
import HttpRoute from "@infrastructure/express/interfaces/HttpControler.interface";

const { Get, JsonController } = routingControllers;

@injectable()
@JsonController("/health")
export default class HealthController implements HttpRoute {
  @Get("")
  public async get (): Promise<object> {
    return new Promise((resolve) => {
      resolve({ status: "UP" });
    });
  }
}
