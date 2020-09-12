import { RequestHandler, Request, Response, NextFunction, BeforeMiddleware, Middleware } from "./middleware";
import hpp from "hpp";

@Middleware({ type: "before" })
export default class HppMiddleware implements BeforeMiddleware {
  private readonly handler: RequestHandler = hpp();
  public use (request: Request, response: Response, next: NextFunction): void {
    this.handler(request, response, next);
  }
}
