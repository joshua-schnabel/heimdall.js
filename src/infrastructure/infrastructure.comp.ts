import AutoLoadable from "@autoload/autoloadable";
import { Lifecycle, registry } from "@autoload/tsyringe";
import { symbol as IASymbol } from "@application/interfaces/infrastructureAdapter.interface";
import HttpInfrastructure from "./express/HttpInfrastructure";
import HelmetMiddleware from "./express/middlewares/helmet.middleware";
import { BeforeMiddlewareSymbol, AfterMiddlewareSymbol } from "./express/middlewares/middleware";
import CorsMiddleware from "./express/middlewares/cors.middleware";
import JsonMiddleware from "./express/middlewares/json.middleware";
import UrlEncodeMiddleware from "./express/middlewares/urlencode.middleware";
import HppMiddleware from "./express/middlewares/hpp.middleware";
import CookieMiddleware from "./express/middlewares/cookie.middleware";
import LoggingMiddleware from "./express/middlewares/logging.middleware";
import ErrorMiddleware from "./express/middlewares/error.middleware";
import { symbol as MRSymbol } from "@domain/message/MessageRepository";
import MQTTInfrastructure, { MQTTEventListener } from "./communication/mqtt/MQTTInfrastructure";
import TextMiddleware from "./express/middlewares/text.middleware";
import RawMiddleware from "./express/middlewares/raw.middleware";
import { LevelDBInfrastructure, LevelDBRepository } from "./persistens/leveldb/LevelDBInfrastructure";
import { symbol as ELSymbol } from "@domain/types/EventListener";
import PrometheusMiddleware from "./express/middlewares/prometheus.middleware";
import PrometheusInfrastructure, { PrometheusMetricsAdapter, PrometheusEventListener } from "./presentation/prometheus/PrometheusInfrastructure";

@registry([
  {
    token: MRSymbol,
    useClass: LevelDBRepository,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: IASymbol,
    useClass: PrometheusInfrastructure,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: PrometheusMetricsAdapter,
    useClass: PrometheusMetricsAdapter,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: ELSymbol,
    useClass: MQTTEventListener,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: ELSymbol,
    useClass: PrometheusEventListener,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: AfterMiddlewareSymbol,
    useClass: ErrorMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: AfterMiddlewareSymbol,
    useClass: LoggingMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: HelmetMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: UrlEncodeMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: CookieMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: JsonMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: TextMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: PrometheusMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: RawMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: HppMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: BeforeMiddlewareSymbol,
    useClass: CorsMiddleware,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: IASymbol,
    useClass: MQTTInfrastructure,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: IASymbol,
    useClass: HttpInfrastructure,
    options: { lifecycle: Lifecycle.Singleton }
  },
  {
    token: IASymbol,
    useClass: LevelDBInfrastructure,
    options: { lifecycle: Lifecycle.Singleton }
  }
])
class InfrastructureAutoLoadable extends AutoLoadable {
  public load (): void {}
}

export default new InfrastructureAutoLoadable();
