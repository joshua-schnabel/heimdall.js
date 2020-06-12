import { cleanEnv, CleanEnv, str, port } from "envalid";
import { safeLoad } from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";

export class Config {
  private static instance: Config = null;
  private p_env: CleanEnv & { readonly [varName: string]: string | undefined };
  private p_config: Record<string, unknown>;
  private p_defaultConfig: Record<string, unknown>;
  
  private constructor () {
    this.loadEnviroment();
    this.loadYAML();
  }
  
  public static getInstance (): Config {
    if (Config.instance == null) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
  public getValue (...key: string[]): (string | number | undefined) {
    key = this.getKey(key);
    let value = undefined;
    value = this.getEnvConfig(key);
    if (value == undefined) value = this.getConfigConfig(key);
    if (value == undefined) value = this.getDefaultConfig(key);
    return value;
  }
  public env (): CleanEnv {
    return this.p_env;
  }

  private loadYAML (): void {
    const configFilePath = path.resolve(this.p_env.H_CONFIGDIR + this.p_env.H_CONFIGFILE);
    const defaultConfigFilePath = path.resolve(__dirname, "config.default.yml");

    this.p_defaultConfig = safeLoad(fs.readFileSync(path.resolve(defaultConfigFilePath), "utf8"), { filename: configFilePath, json: true });
    if (fs.existsSync(configFilePath)) {
      this.p_config = safeLoad(fs.readFileSync(path.resolve(configFilePath), "utf8"), { filename: configFilePath, json: true });
    }
  }

  private loadEnviroment (): void {
    this.p_env = cleanEnv(process.env, {
      "server.port": port({ default: undefined }),
      H_CONFIGDIR: str({ default: "./config/" }),
      H_CONFIGFILE: str({ default: "config.yml", devDefault: "config.dev.yml" })
    });
  }

  private getEnvConfig (tkey: string[]): string {
    return this.p_env[tkey.join(".")];
  }

  private getConfigConfig (key: string[]): (string | number | undefined) {
    return (this.p_config !== null) ? this.findRecursiv(this.p_config, _.cloneDeep(key)) : undefined;
  }

  private getDefaultConfig (key: string[]): (string | number | undefined) {
    return (this.p_defaultConfig !== null) ? this.findRecursiv(this.p_defaultConfig, _.cloneDeep(key)) : undefined;
  }

  private findRecursiv (p_config: Record<string, unknown>, key: string[]): (string | number | undefined) {
    const ckey = key.shift();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (Object.prototype.hasOwnProperty.call(p_config, ckey)) {
      if (key.length > 0) {
        return this.findRecursiv(<Record<string, unknown>> p_config[ckey], key);
      } else {
        return <(string | number)> p_config[ckey];
      }
    } else {
      return undefined;
    }
  }

  private getKey (key: string[]): string[] {
    if(key.length == 1 && key[0].includes("."))
      return key[0].split(".");
    return key;
  }
}

export const CONF = Config.getInstance();
export default Config.getInstance();