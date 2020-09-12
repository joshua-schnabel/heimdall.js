import { RequestHandler, Request, Response, NextFunction, BeforeMiddleware, Middleware } from "./middleware";
import express from "express";

@Middleware({ type: "before" })
export default class RawMiddleware implements BeforeMiddleware {
  private readonly handler: RequestHandler = express.raw({ type: "application/*" });
  public use (request: Request, response: Response, next: NextFunction): void {
    this.handler(request, response, next);
  }
}
