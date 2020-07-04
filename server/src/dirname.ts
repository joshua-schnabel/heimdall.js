import path from "path";
import url from "url";
import os from "os";

export function dirname (): string {
  try {
    throw new Error("Something bad happened");
  } catch (e) {
    const initiator = (<Error> e).stack.split("\n").slice(2, 3)[0];
    let lpath = /(?<path>[^\\(\s]+):[0-9]+:[0-9]+/.exec(initiator).groups.path;
    if (lpath.includes("file")) {
      lpath = new url.URL(lpath).pathname;
    }
    let ldirname = path.dirname(lpath);
    if (ldirname.startsWith("/") && os.platform() === "win32") {
      ldirname = ldirname.slice(1);
    }
    return ldirname;
  }
}
