import { RequestHandler, Request, Response, NextFunction, BeforeMiddleware, Middleware } from "./middleware";
import helmet from "helmet";

@Middleware({ type: "before" })
export default class HelmetMiddleware implements BeforeMiddleware {
  private readonly handler: RequestHandler = helmet();
  public use (request: Request, response: Response, next: NextFunction): void {
    this.handler(request, response, next);
  }
}
