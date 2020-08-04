import AutoLoadable from "@autoload/autoloadable";
import { registry } from "@autoload/tsyringe";
import { symbol } from "@infrastructure/express/interfaces/HttpControler.interface";
import MqttApiController from "./mqtt.controller";

@registry([
  {
    token: symbol,
    useClass: MqttApiController
  }
])
class HttpPresentationAutoLoadable extends AutoLoadable {
  public load (): void { }
}

export default new HttpPresentationAutoLoadable();
