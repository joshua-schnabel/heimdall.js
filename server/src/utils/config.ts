import { cleanEnv, CleanEnv, str, port } from "envalid";
import { safeLoad } from "js-yaml";
import * as fs from 'fs';
import * as path from 'path';

export class Config {
  private static instance: Config;

  private p_env: CleanEnv & { readonly [varName: string]: string | undefined };
  private p_config: any;
  private p_defaultConfig: any;

  private constructor() {
    this.loadEnviroment();
    this.loadYAML();
  }
  
  private loadYAML() {
    const configFilePath = this.p_env.H_CONFIGDIR + this.p_env.H_CONFIGFILE;
    const defaultConfigFilePath = path.resolve(__dirname, "config.defaul.yml");

    this.p_defaultConfig = safeLoad(fs.readFileSync(path.resolve(defaultConfigFilePath), 'utf8'), {filename: configFilePath, json: true})
    if(fs.existsSync(configFilePath)) {
      this.p_config = safeLoad(fs.readFileSync(path.resolve(configFilePath), 'utf8'), {filename: configFilePath, json: true})
    }

    console.log(this.p_config);
    console.log(this.p_defaultConfig);
  }

  private loadEnviroment() {
    this.p_env = cleanEnv(process.env, {
      "server.port": port({ default: undefined }),
      H_CONFIGDIR: str({ default: './config/'}),
      H_CONFIGFILE: str({ default: 'config.yml', devDefault: 'config.dev.yml'})
    });
  }

  private getEnvConfig(tkey: string[]): any {
    return this.p_env[tkey.join(".")];
  }

  private getConfigConfig(key: string[]): any {
    return this.findRecursiv(this.p_config, key);
  }
  
  private getDefaultConfig(key: string[]): any {
    return this.findRecursiv(this.p_defaultConfig, key);
  }

  private findRecursiv(p_config: any, key: string[]): any {
    const ckey = key.shift();
    if(key.length > 1) {
      return this.findRecursiv(p_config[ckey], key)
    } else {
      return p_config[ckey]
    }
  }

  public getConfig(...key: string[]): any {
    let value = undefined;
    if(value == undefined) value = this.getEnvConfig(key);
    if(value == undefined) value = this.getConfigConfig(key);
    if(value == undefined) value = this.getDefaultConfig(key);
    return value;
  }

  public env(): CleanEnv {
    return this.p_env;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}