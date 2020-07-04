import AutoLoadable from "../autoload/autoloadable";
import { Lifecycle, registry } from "../autoload/tsyringe";
import App from "./app";

@registry([
  { token: App, useClass: App, options: { lifecycle: Lifecycle.Singleton } }
])
class AppAutoLoadable extends AutoLoadable {
  public load (): void { }
}

export default new AppAutoLoadable();
