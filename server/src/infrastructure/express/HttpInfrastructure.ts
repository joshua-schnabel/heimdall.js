import CONF from "@config";
import { log, Logger } from "@logger";
import HttpControler, { symbol as hcSymbol } from "./interfaces/HttpControler.interface";
import { Express } from "express";
import InfrastructureAdapter from "@application/interfaces/infrastructureAdapter.interface";
import { injectable, injectAll } from "@autoload/tsyringe";
import rc from "routing-controllers";
import { BeforeMiddlewareSymbol, BeforeMiddleware, AfterMiddlewareSymbol } from "./middlewares/middleware";
import auth from "./HttpAuth";

const LOG: Logger = log("http");

// import * as swaggerJSDoc from "swagger-jsdoc";
// import * as swaggerUi from "swagger-ui-express";

@injectable()
export default class HttpInfrastructure implements InfrastructureAdapter {
  public readonly port: string | number;

  private readonly controler: Function[] = [];
  private readonly middleware: Function[] = [];

  private app: Express;

  public constructor (
    @injectAll(hcSymbol) controler: HttpControler[],
    @injectAll(BeforeMiddlewareSymbol) beforeMiddleware: BeforeMiddleware[],
    @injectAll(AfterMiddlewareSymbol) afterMiddleware: BeforeMiddleware[]
  ) {
    this.port = CONF.getValue("server.port");
    controler.forEach((c) => {
      this.controler.push(c.constructor);
    });
    LOG.info("Register %d Controllers", controler.length);
    beforeMiddleware.forEach((c) => {
      this.middleware.push(c.constructor);
    });
    LOG.info("Register %d Middlewares with before", beforeMiddleware.length - 1);
    afterMiddleware.forEach((c) => {
      this.middleware.push(c.constructor);
    });
    LOG.info("Register %d Middlewares with after", afterMiddleware.length - 1);
  }

  public priority (): number {
    const prio = 10;
    return prio;
  }

  public start (): void {
    this.app = rc.createExpressServer({
      controllers: this.controler,
      middlewares: this.middleware,
      defaultErrorHandler: false,
      authorizationChecker: auth
    });
    LOG.info("Start HTTP");
    this.listen();
  }

  private listen (): void {
    this.app.listen(this.port, () => {
      LOG.info("Server listening on the port %d", this.port);
    });
  }
}
