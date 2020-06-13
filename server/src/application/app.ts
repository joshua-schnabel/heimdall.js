import printBanner from "./utils/banner";
import CONF from "./utils/config";
import configLogger, { log, LOG } from "./utils/logger";
import * as log4js from "log4js";
import Routes from "./express/routes.interface";
import * as express from "express";
import * as helmet from "helmet";
import * as hpp from "hpp";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";

export default class App {
  public readonly app: express.Application;
  public readonly port: (string | number);

  public constructor (routes: Routes[]) {
    printBanner();
    configLogger();

    this.app = express();
    this.port = CONF.getValue("server.port");

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    // this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen (): void {
    this.app.listen(this.port, () => {
      LOG.info("Server listening on the port %d", this.port);
    });
  }

  private initializeErrorHandling (): void {
    this.app.use(errorMiddleware);
  }

  private initializeMiddlewares (): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(hpp());
    this.app.use(helmet());

    if (CONF.env().isDev) {
      this.app.use(log4js.connectLogger(log("http"), { level: "info" }));
    } else {
      this.app.use(log4js.connectLogger(log("http"), { level: "debug" }));
    }
  }

  private initializeRoutes (routes: Routes[]): void {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }
}
