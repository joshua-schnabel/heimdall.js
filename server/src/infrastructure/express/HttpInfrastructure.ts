import CONF from "../../application/configuration/config";
import LOG, { log } from "../../application/logging/logger";
import * as log4js from "log4js";
import Route from "./HttpRoute.interface";
import * as express from "express";
import * as helmet from "helmet";
import * as hpp from "hpp";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";
import InfrastructureAdapter from "../../application/interfaces/infrastructureAdapter.interface";
import { injectable, injectAll } from "tsyringe";
// import * as swaggerJSDoc from "swagger-jsdoc";
// import * as swaggerUi from "swagger-ui-express";

@injectable()
export default class HttpInfrastructure implements InfrastructureAdapter {
  public readonly app: express.Application;
  public readonly port: (string | number);

  private readonly routes: Route[];

  public constructor (@injectAll("HttpRoute") routes: Route[]) {
    this.app = express();
    this.port = CONF.getValue("server.port");
    this.routes = routes;
  }

  public start (): void {
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen (): void {
    this.app.listen(this.port, () => {
      LOG.info("Server listening on the port %d", this.port);
    });
  }

  private initializeSwagger (): void {
    const options = {
      swaggerDefinition: {
        info: {
          title: "REST API",
          version: "1.0.0",
          description: "Example docs"
        }
      },
      apis: ["swagger.yaml"]
    };
    // const specs = swaggerJSDoc(options);
    // this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
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

  private initializeRoutes (routes: Route[]): void {
    routes.forEach((route: Route) => {
      this.app.use("/", route.router);
    });
  }
}
