import log4js from "log4js";
import { Config } from "@config";

const { configure, getLogger } = log4js;
type Logger = log4js.Logger;

export { Logger };

export function configLogger (): void {
  configure(<string> Config.getInstance().getValue("log4js"));
}

configLogger();

export default getLogger();
export const LOG = getLogger();
export function log (name: string): Logger {
  return getLogger(name);
}
