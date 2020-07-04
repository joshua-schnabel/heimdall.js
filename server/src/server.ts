/* eslint-disable no-console */
import "reflect-metadata";
import "./application/logging/logger";
import DEP from "./autoload/types.config";
import App from "./application/app";

DEP.resolve(App).start();
