import Routes from "./express/routes.interface";
import * as express from "express";
import CONF from "./utils/config";
import configLogger, {LOG} from "./utils/logger";
import print_banner from "./utils/banner";

export default class App {

    public readonly app: express.Application;

    public readonly port: (string | number);

    public constructor (routes: Routes[]) {
      print_banner();
      configLogger();

      this.app = express();
      this.port = CONF.getValue("server.port");

      console.log(routes);
    
      //this.initializeMiddlewares();
      //this.initializeRoutes(routes);
      //this.initializeSwagger();
      //this.initializeErrorHandling();
    }

    public listen (): void {
      //this.app.listen(this.port, () => {
      LOG.info("Server listening on the port %d", this.port);
      //});
    }
}