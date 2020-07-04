/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable-next-line @typescript-eslint/no-extraneous-class */
import { container } from "./tsyringe";
import glob from "fast-glob";
import path from "path";
import { log } from "../application/logging/logger";
import AutoLoadable from "./autoloadable";
import Module from "module";

class AutoConfiguration {
  public async load (): Promise<void> {
    await this.loadTypes();
    log("auto").info("AutoConfiguration finished");
  }

  private async loadTypes (): Promise<void> {
    const root = path.resolve(".").replace(/\\/g, "/");
    log("auto").debug("Autoload from folder '%s'", root);
    const result = await glob(root + "/**/*.comp.ts");

    const promises: Promise<Module>[] = [];

    result.forEach((element) => {
      const url = "file://" + element;
      log("auto").debug("Load file '%s'", url);
      promises.push(import(url));
    });
    return Promise.allSettled(promises)
      .then((results) => {
        log("auto").debug("Loading %d files", result.length);
        results.forEach((result: PromiseSettledResult<unknown>) => {
          if (result.status === "fulfilled") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let value = <any> result.value;
            if (Object.prototype.hasOwnProperty.call(value, "default")) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              value = value.default;
              if (typeof value === "object" && value instanceof AutoLoadable) {
                log("auto").debug("Load file sucessfull");
                try {
                  value.load();
                } catch (error) {
                  log("auto").error("Load %s not sucessfull (%s)", value.constructor.name, error);
                }
              } else {
                log("auto").error("Load file not sucessfull. %s is no instance of AutoLoadable", value);
              }
            } else {
              log("auto").error("Load file not sucessfull. No default export");
            }
          } else {
            log("auto").error("Load file not sucessfull: %s", result.reason);
          }
        });
      })
      .catch((error: Error) => {
        log("auto").error("Load file not sucessfull '%s'", error.message);
      });
  }
}

const autoConfig = new AutoConfiguration();
await autoConfig.load();

export { autoConfig };

export default container;
