/* eslint-disable @typescript-eslint/no-magic-numbers */
import { RequestHandler, Request, Response, ExpressErrorMiddlewareInterface, NextFunction, Middleware } from "./middleware";
import HttpException from "../exceptions/HttpException";
import HttpStatus from "http-status-codes";
import log4js from "log4js"; import { log } from "@application/logging/logger";

@Middleware({ type: "after" })
export default class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  private readonly lowHandler: RequestHandler;
  private readonly hightHandler: RequestHandler;

  public constructor () {
    this.lowHandler = log4js.connectLogger(log("http"), { level: "info" });
    this.hightHandler = log4js.connectLogger(log("http"), { level: "warn" });
  }

  public error (error: HttpException, req: Request, res: Response, _next: NextFunction): void {
    const status: number = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message: string = error.message || "Radical bytes have stolen a variable.";

    if (status >= 400 && status <= 499) {
      log("http").warn("A HTTP error %d accured: %s", status, message);
      this.lowHandler(req, res, function () { });
    } else if (status >= 500 && status <= 599) {
      log("http").error("A critical HTTP error %d accured: %s", status, message);
      this.hightHandler(req, res, function () { });
    } else {
      this.lowHandler(req, res, function () { });
    }

    if (log("http").isTraceEnabled()) {
      log("http").trace("HttpException trace: ", error.stack);
    }

    res.status(status).json({ status, message });
  }
}

