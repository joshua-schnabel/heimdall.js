import AutoLoadable from "../../../autoload/autoloadable";
import { registry } from "../../../autoload/tsyringe";
import { symbol } from "../../express/interfaces/HttpControler.interface";
import index from "./index";

@registry([
  {
    token: symbol,
    useClass: index
  }
])
class HttpPresentationAutoLoadable extends AutoLoadable {
  public load (): void { }
}

export default new HttpPresentationAutoLoadable();
