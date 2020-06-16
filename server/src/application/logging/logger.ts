import { configure, getLogger, Logger } from "log4js";
import { Config } from "../configuration/config";

export function configLogger (): void {
  configure(<string> Config.getInstance().getValue("log4js"));
}

export default getLogger();
export const LOG = getLogger();
export function log (name: string): Logger {
  return getLogger(name);
}
