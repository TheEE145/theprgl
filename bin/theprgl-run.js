#!/usr/bin/env node
const process = require('process');
const RunHandler = require('./run-handler');
const fs = require('fs');
const err = require('./err').error;

let args = [];
for(let i = 2; i < process.argv.length; i++) {
    args.push(process.argv[i]);
};

for(let i = process.argv[1].length; i > 0; i--) {
    if((process.argv[1][i] == '\\') || (process.argv[1][i] == '/')) {
        process.argv[1] = process.argv[1].substring(0, i);
        break;
    };
};

let 
    file = null, 
    attributes = [], 
    argv = [],
    argvwrite = false;

for(arg of args) {
    if(arg.startsWith('--')) {
        attributes.push(arg.substring(2));
        continue;
    };

    if(arg == '::') {
        argvwrite = true;
        continue;
    };

    if(argvwrite) {
        argv.push(arg);
        continue;
    };

    file = arg;
};

if(!fs.existsSync(file)) {
    err('file or directory doesn`t exists');
};

if(!fs.lstatSync(file).isDirectory()) {
    if(!(file.endsWith('.prgl') || file.endsWith('.theprgl'))) {
        err('this file not .prgl or .theprgl exception');
    };
    
    RunHandler.Runtime.exec(
        fs.readFileSync(file, 'utf8'), 
        false, 
        process.argv[1],
        argv,
        attributes
    );

    process.exit(0);
};