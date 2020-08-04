import printBanner from "./banner";
import log, { configLogger } from "./logging/logger";
import InfrastructureAdapter, { symbol as IASymbol } from "./interfaces/infrastructureAdapter.interface";
import { injectable, injectAll, inject } from "@autoload/tsyringe";
import EventManager from "@application/events/EventManager";

@injectable()
class App {
  private readonly adapter: InfrastructureAdapter[] = [];
   private readonly eventManager: EventManager;

   public constructor (@injectAll(IASymbol) adapter: InfrastructureAdapter[], @inject(EventManager) eventManager: EventManager) {
     this.adapter = adapter;
     this.eventManager = eventManager;
   }

   public start (): void {
     printBanner();
     configLogger();
     this.startInfrastructure(this.adapter);
   }

   private startInfrastructure (adapter: InfrastructureAdapter[]): void {
     log.info("Start Infrastructure Adapters...");
     adapter.forEach(element => {
       element.start();
     });
   }
}

export default App;
