import { Request } from "express";
import HttpException from "@infrastructure/express/exceptions/HttpException";
import HttpStatus from "http-status-codes";

export function AcceptContentType (contentType: string[] | string): Function {
  return Reflect.metadata("accept:contenttype", contentType);
}

function getMethodName (): string {
  const err = new Error();
  return /at \w+\.(\w+)/.exec(err.stack.split("\n")[3])[1]; // we want the 2nd method in the call stack
}

export function testContentType (object: Object, request: Request): void {
  const typesMeta = Reflect.getMetadata("accept:contenttype", object, getMethodName());
  let types: string[] = [];
  if (typeof typesMeta === "string") {
    types = [typesMeta];
  } else {
    types = typesMeta;
  }
  let found = false;
  const contentType = request.headers["content-type"] || "";
  types.forEach(type => {
    if (contentType.startsWith(type)) {
      found = true;
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!found) { throw new HttpException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Content-Type '" + contentType + "' is not supported!"); }
}
