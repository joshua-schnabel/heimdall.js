/* eslint-disable no-console */
import clc from "cli-color";

const red = 196;
const orange = 202;
const yellow = 226;
const green = 83;
const aqua = 38;
const blue = 27;
const pink = 129;
const purple = 201;

function printBanner (): void {
  const c1 = clc.xterm(red);
  const c2 = clc.xterm(orange);
  const c3 = clc.xterm(yellow);
  const c4 = clc.xterm(green);
  const c5 = clc.xterm(aqua);
  const c6 = clc.xterm(blue);
  const c7 = clc.xterm(pink);
  const c8 = clc.xterm(purple);
  const cV = clc.xterm(aqua);
  console.log(c1(" _   _        _                 _         _  _       _      "));
  console.log(c2("| | | |      (_)               | |       | || |     (_)     "));
  console.log(c3("| |_| |  ___  _  _ __ ___    __| |  __ _ | || |      _  ___ "));
  console.log(c4("|  _  | / _ \\| || '_ ` _ \\  / _` | / _` || || |     | |/ __|"));
  console.log(c5("| | | ||  __/| || | | | | || (_| || (_| || || | _   | |\\__ \\"));
  console.log(c6("\\_| |_/ \\___||_||_| |_| |_| \\__,_| \\__,_||_||_|(_)  | ||___/"));
  console.log(c7("                                                   _/ |     "));
  console.log(cV("     Server 1.0.0") + c8("                                 |__/      "));
  console.log("");
}

export default printBanner;
