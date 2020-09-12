import { RequestHandler, Request, Response, NextFunction, BeforeMiddleware, Middleware } from "./middleware";
import multer from "multer";

@Middleware({ type: "before" })
export default class MulterMiddleware implements BeforeMiddleware {
  private readonly handler: RequestHandler = multer().none();
  public use (request: Request, response: Response, next: NextFunction): void {
    this.handler(request, response, (err: unknown) => {
      next(err);
    });
  }
}
