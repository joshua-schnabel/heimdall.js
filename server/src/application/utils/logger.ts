import { configure, getLogger } from "log4js";
import { Config } from "./config";

function configLogger() {
  configure(Config.getInstance().getValue("log4js"));
}

export default configLogger;

export const LOG = getLogger();
export function log(name: string) {
  return getLogger(name);
}
