#!/usr/bin/env node
const process = require('process');
const fs = require('fs');
const err = require('./err');

let args = [];
for(let i = 2; i < process.argv.length; i++) {
    args.push(process.argv[i]);
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
    
    console.log('succes');
    process.exit(0);
};