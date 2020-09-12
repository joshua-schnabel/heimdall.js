import { RequestHandler, Request, Response, NextFunction, BeforeMiddleware, Middleware } from "./middleware";
import cors from "cors";

@Middleware({ type: "before" })
export default class CorsMiddleware implements BeforeMiddleware {
  private readonly handler: RequestHandler = cors();
  public use (request: Request, response: Response, next: NextFunction): void {
    this.handler(request, response, next);
  }
}
