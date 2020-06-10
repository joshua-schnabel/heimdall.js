import * as clc from 'cli-color'

function print_banner() {
    var c1 = clc.xterm(196);
    var c2 = clc.xterm(202);
    var c3 = clc.xterm(226);
    var c4 = clc.xterm(83);
    var c5 = clc.xterm(38);
    var c6 = clc.xterm(27);
    var c7 = clc.xterm(129);
    var c8 = clc.xterm(201);
    var cV = clc.xterm(43);
    console.log(c1(" _   _        _                 _         _  _       _      "));
    console.log(c2("| | | |      (_)               | |       | || |     (_)     "));
    console.log(c3("| |_| |  ___  _  _ __ ___    __| |  __ _ | || |      _  ___ "));
    console.log(c4("|  _  | / _ \\| || '_ ` _ \\  / _` | / _` || || |     | |/ __|"));
    console.log(c5("| | | ||  __/| || | | | | || (_| || (_| || || | _   | |\\__ \\"));
    console.log(c6("\\_| |_/ \\___||_||_| |_| |_| \\__,_| \\__,_||_||_|(_)  | ||___/"));
    console.log(c7("                                                   _/ |     "));
    console.log(cV("     Server 1.0.0") + c8("                                 |__/      "));
    console.log("");
};

export default print_banner;