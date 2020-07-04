import { RequestHandler, Request, Response, NextFunction, BeforeMiddleware, Middleware } from "./middleware";
import log4js from "log4js";
import CONF from "../../../application/configuration/config";
import { log } from "../../../application/logging/logger";

@Middleware({ type: "after" })
export default class LoggingMiddleware implements BeforeMiddleware {
  private readonly handler: RequestHandler;

  public constructor () {
    if (CONF.env().isDev) {
      this.handler = log4js.connectLogger(log("http"), { level: "info" });
    } else {
      this.handler = log4js.connectLogger(log("http"), { level: "debug" });
    }
  }

  public use (request: Request, response: Response, next: NextFunction): void {
    this.handler(request, response, next);
  }
}
