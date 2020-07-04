import LOG from "../../application/logging/logger";
import InfrastructureAdapter from "../../application/interfaces/infrastructureAdapter.interface";
import { injectable } from "../../autoload/tsyringe";

@injectable()
export default class MQTTInfrastructure implements InfrastructureAdapter {
  public start (): void {
    LOG.error("Start MQTT");
  }
}
