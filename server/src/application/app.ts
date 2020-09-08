import printBanner from "./banner";
import log, { configLogger } from "./logging/logger";
import InfrastructureAdapter, { symbol as IASymbol } from "./interfaces/infrastructureAdapter.interface";
import { injectable, injectAll } from "@autoload/tsyringe"; import lodash from "lodash";

@injectable()
class App {
  private readonly adapter: InfrastructureAdapter[] = [];

  public constructor (@injectAll(IASymbol) adapter: InfrastructureAdapter[]) {
    this.adapter = adapter;
  }

  public start (): void {
    printBanner();
    configLogger();
    this.startInfrastructure(this.adapter);
  }

  private startInfrastructure (adapter: InfrastructureAdapter[]): void {
    adapter = lodash.sortBy(adapter, [function (a: InfrastructureAdapter): number { return a.priority(); }]);
    log.info("Start Infrastructure Adapters...");
    adapter.forEach(element => {
      element.start();
    });
  }
}

export default App;
