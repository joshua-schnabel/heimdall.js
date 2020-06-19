/* eslint-disable no-console */
import "reflect-metadata";
import DEP from "./inversify.config";
import App from "./application/app";

// DEP.get(App).start();

console.log(DEP.get(App) === DEP.get(App));
console.log(DEP.createChild().get(App) === DEP.get(App));
console.log(DEP.createChild().get(App) === DEP.createChild().get(App));

const DEP2 = DEP.createChild();
console.log(DEP2.get(App) === DEP2.get(App));
