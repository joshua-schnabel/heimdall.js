import Routes from './express/routes.interface';
import * as express from 'express';
import CONF from './utils/config'
import configLogger, {LOG, log} from "./utils/logger";
import print_banner from "./utils/banner";


export default class App {

    public readonly app: express.Application;
    public readonly port: (string | number);

    constructor(...routes: Routes[]) {
        print_banner()
        configLogger();

        this.app = express();
        this.port = CONF.getValue("server.port");
    
        //this.initializeMiddlewares();
        //this.initializeRoutes(routes);
        //this.initializeSwagger();
        //this.initializeErrorHandling();
    }

    public listen() {
        //this.app.listen(this.port, () => {
          console.log("🚀 Server listening on the port %d", this.port);
        //});
      }
}