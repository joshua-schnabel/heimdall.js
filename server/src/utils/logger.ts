import { configure } from "log4js";

function configLogger() {
    configure({
        appenders: {
            stdout: { type: 'stdout' },
            err: { type: 'stderr' },

        },
        categories: {
            default: { appenders: ["stdout"], level: "info" },
            debug: { appenders: ["stdout"], level: "debug" },
            http: { appenders: ["stdout"], level: "error" },
            security: { appenders: ["err"], level: "error" } 
        }
    });
};

export default configLogger;