import { IncomingMessage, ServerResponse } from "http";
import { Action } from "routing-controllers";
import CONF from "@config";
import { log, Logger } from "@logger";
import HttpException from "./exceptions/HttpException";
import HttpStatus from "http-status-codes";
import pkg from "@mreal/digest-auth";
import CryptoJS from "crypto-js";

const { ServerDigestAuth } = pkg;

const LOG: Logger = log("http");

// eslint-disable-next-line @typescript-eslint/require-await
export default async function (action: Action, roles: string[]): Promise<boolean> {
  const request: IncomingMessage = action.request;
  const response: ServerResponse = action.response;
  if (request.headers["x-api-key"] !== undefined) {
    const username = (<string> request.headers["x-api-key"]).split(":")[0];
    const secret = (<string> request.headers["x-api-key"]).split(":")[1];
    let apikey = <string> CONF.getValue("users", username, "api-key");
    apikey = CryptoJS.SHA256(apikey).toString(CryptoJS.enc.Base64);
    const rights = <string> CONF.getValue("users", username, "rights");
    if (apikey === secret) {
      return roles.length > 0 && rights.split(",").includes(roles[0]);
    }
  }
  if (request.headers.authorization !== undefined) {
    const incomingDigest = ServerDigestAuth.analyze(request.headers.authorization, ["auth"]);
    LOG.info("Login from user %s.", incomingDigest.username);
    const password = <string> CONF.getValue("users", incomingDigest.username, "password");
    const result = ServerDigestAuth.verifyByPassword(incomingDigest, password, {
      method: request.method,
      uri: request.url,
      entryBody: ""
    });
    const rights = <string> CONF.getValue("users", incomingDigest.username, "rights");
    if (result) {
      return roles.length > 0 && rights.split(",").includes(roles[0]);
    }
  }
  response.setHeader("WWW-Authenticate", ServerDigestAuth.generateResponse("digest", { algorithm: "MD5-sess", qop: "auth" }).raw);
  throw new HttpException(HttpStatus.UNAUTHORIZED, "Please provide authentication infomations!");
}
