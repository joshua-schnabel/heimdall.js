import AutoLoadable from "@autoload/autoloadable";
import { Lifecycle, registry } from "@autoload/tsyringe";
import MessagePersistor from "@domain/message/MessagePersistor";
import { symbol as ELSymbol } from "@domain/types/EventListener";

@registry([
  { token: ELSymbol, useClass: MessagePersistor, options: { lifecycle: Lifecycle.Singleton } }
])
class AppAutoLoadable extends AutoLoadable {
  public load (): void { }
}

export default new AppAutoLoadable();
