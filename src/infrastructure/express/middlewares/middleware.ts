/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import rc, { ExpressMiddlewareInterface, ExpressErrorMiddlewareInterface } from "routing-controllers";
import { RequestHandler, Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { registry } from "@autoload/tsyringe";

const { UseBefore, UseAfter, Middleware } = rc;

export const BeforeMiddlewareSymbol = Symbol.for("BeforeMiddleware");
export const AfterMiddlewareSymbol = Symbol.for("AfterMiddleware");

export { UseBefore, UseAfter, ExpressMiddlewareInterface, RequestHandler, Middleware, Request, Response, NextFunction, ExpressErrorMiddlewareInterface };

export abstract class BeforeMiddleware implements ExpressMiddlewareInterface {
    public abstract use(request: Request, response: Response, next: NextFunction): void;
}

export abstract class AfterMiddleware implements ExpressMiddlewareInterface {
    public abstract use(request: Request, response: Response, next: NextFunction): void;
}
export class DefaultAfterMiddleware implements AfterMiddleware {
  public use (_request: Request, _response: Response, next: NextFunction): void {
    next();
  }
}

export class DefaultBeforeMiddleware implements BeforeMiddleware {
  public use (_request: Request, _response: Response, next: NextFunction): void {
    next();
  }
}
@registry([
  {
    token: BeforeMiddlewareSymbol,
    useClass: DefaultAfterMiddleware
  }, {
    token: AfterMiddlewareSymbol,
    useClass: DefaultBeforeMiddleware
  }])
class DefaultTypes {

}
