import log4js from "log4js";
import { Config } from "../configuration/config";

const { configure, getLogger } = log4js;

export function configLogger (): void {
  configure(<string> Config.getInstance().getValue("log4js"));
}

configLogger();

export default getLogger();
export const LOG = getLogger();
export function log (name: string): log4js.Logger {
  return getLogger(name);
}
