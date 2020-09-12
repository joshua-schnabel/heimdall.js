import AutoLoadable from "@autoload/autoloadable";
import { registry } from "@autoload/tsyringe";
import { symbol } from "@infrastructure/express/interfaces/HttpControler.interface";
import MqttApiController from "./mqtt.controller";
import PrometheusController from "./prometheus.controller";
import HealthController from "./health.controller";

@registry([
  {
    token: symbol,
    useClass: MqttApiController
  }, {
    token: symbol,
    useClass: PrometheusController
  }, {
    token: symbol,
    useClass: HealthController
  }
])
class HttpPresentationAutoLoadable extends AutoLoadable {
  public load (): void { }
}

export default new HttpPresentationAutoLoadable();
