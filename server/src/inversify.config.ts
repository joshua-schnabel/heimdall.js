import { Container } from "inversify";
import App from "./application/app";
import { symbol as IASymbol } from "./application/interfaces/infrastructureAdapter.interface";
import HttpInfrastructure from "./infrastructure/express/HttpInfrastructure";
import MqttInfrastructure from "./infrastructure/express/MQTTInfrastructure";

const myContainer = new Container();
myContainer.bind<App>(App).to(App).inRequestScope();
myContainer.bind<HttpInfrastructure>(IASymbol).to(HttpInfrastructure);
myContainer.bind<MqttInfrastructure>(IASymbol).to(MqttInfrastructure);

export default myContainer;
