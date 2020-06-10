import configLogger from "./utils/logger";
import { getLogger } from "log4js";
import print_banner from "./utils/banner";
import {Config} from "./utils/config";

print_banner()

console.log("TEST");

Config.getInstance();

configLogger();

console.log("TEST", Config.getInstance().getConfig("server","port"))