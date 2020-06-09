import * as clc from 'cli-color'

function print_banner() {
    var c1 = clc.xterm(27);
    var c2 = clc.xterm(27);
    var c3 = clc.xterm(27);
    var c4 = clc.xterm(27);
    var c5 = clc.xterm(27);
    var c6 = clc.xterm(27);
    var c7 = clc.xterm(27);
    var c8 = clc.xterm(27);
    var cV = clc.xterm(27);
    console.log(c1(" _   _        _                 _         _  _       _      "));
    console.log("| | | |      (_)               | |       | || |     (_)     ");
    console.log("| |_| |  ___  _  _ __ ___    __| |  __ _ | || |      _  ___ ");
    console.log("|  _  | / _ \\| || '_ ` _ \\  / _` | / _` || || |     | |/ __|");
    console.log("| | | ||  __/| || | | | | || (_| || (_| || || | _   | |\\__ \\");
    console.log("\\_| |_/ \\___||_||_| |_| |_| \\__,_| \\__,_||_||_|(_)  | ||___/");
    console.log("                                                   _/ |     ");
    console.log("     Server 1.0.0                                 |__/      ");
    console.log("");
};

export default print_banner;