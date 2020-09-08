/* eslint-disable @typescript-eslint/require-await */
import routingControllers from "routing-controllers";
import { injectable, container } from "@autoload/tsyringe";
import HttpRoute from "@infrastructure/express/interfaces/HttpControler.interface";
import PrometheusInfrastructure, { PrometheusMetricsAdapter } from "../prometheus/PrometheusInfrastructure";

const { Get, Controller } = routingControllers;

@injectable()
@Controller()
export default class PrometheusController implements HttpRoute {
 private readonly stats: PrometheusInfrastructure;

 public constructor () {
   this.stats = container.resolve(PrometheusMetricsAdapter).get();
 }

  @Get("/metrics")
 public async get (): Promise<string> {
   return this.stats.getMetrics();
 }
}
