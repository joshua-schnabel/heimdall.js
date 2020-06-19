import LOG from "../../application/logging/logger";
import InfrastructureAdapter from "../../application/interfaces/infrastructureAdapter.interface";
import { injectable } from "inversify";

@injectable()
export default class MQTTInfrastructure implements InfrastructureAdapter {
  public start (): void {
    LOG.error("Start MQTT");
  }
}
