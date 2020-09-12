import { RequestHandler, Request, Response, NextFunction, BeforeMiddleware, Middleware } from "./middleware";
import cookieParser from "cookie-parser";

@Middleware({ type: "before" })
export default class CookieMiddleware implements BeforeMiddleware {
  private readonly handler: RequestHandler = cookieParser();
  public use (request: Request, response: Response, next: NextFunction): void {
    this.handler(request, response, next);
  }
}
