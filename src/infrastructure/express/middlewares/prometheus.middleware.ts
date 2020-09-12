import { Request, Response, NextFunction, BeforeMiddleware, Middleware } from "./middleware"; import { PrometheusMetricsAdapter } from "@infrastructure/presentation/prometheus/PrometheusInfrastructure";
import { container } from "@autoload/tsyringe";
import PrometheusHttpStats from "@infrastructure/presentation/prometheus/plugins/PrometheusHttpStats";

const getDurationInMilliseconds = (start: [number, number]): number => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

@Middleware({ type: "before" })
export default class PrometheusMiddleware implements BeforeMiddleware {
  private readonly stats: PrometheusHttpStats;

  public constructor () {
    this.stats = <PrometheusHttpStats> container.resolve(PrometheusMetricsAdapter).get().getPlugin("http");
  }

  public use (request: Request, response: Response, next: NextFunction): void {
    this.stats.newRequest();
    const start = process.hrtime();

    response.on("finish", () => {
      this.stats.request(request.method, response.statusCode, Math.round(getDurationInMilliseconds(start)));
    });
    next();
  }
}
