import configLogger from "./utils/logger";
import { getLogger } from "log4js";
import print_banner from "./utils/banner";

print_banner()

console.log("TEST")

configLogger();

console.log("TEST")

getLogger("http").debug("Some debug messages");
getLogger("http").error("Some error messages");
getLogger().error("Some error messages");
getLogger().fatal("Some fatal messages");

console.log("TEST")