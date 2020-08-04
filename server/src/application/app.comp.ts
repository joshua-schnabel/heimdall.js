import AutoLoadable from "@autoload/autoloadable";
import { Lifecycle, registry } from "@autoload/tsyringe";
import App from "./app";
import EventManager from "./events/EventManager";

@registry([
  { token: App, useClass: App, options: { lifecycle: Lifecycle.Singleton } },
  { token: EventManager, useClass: EventManager, options: { lifecycle: Lifecycle.Singleton } }
])
class AppAutoLoadable extends AutoLoadable {
  public load (): void { }
}

export default new AppAutoLoadable();
