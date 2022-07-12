#!/usr/bin/env node
const process = require('process');
const process_child = require('child_process');
const fs = require('fs');

function err(message) {
    console.log(`\x1b[31mError: ${message}!\x1b[0m`);
    process.exit(1);
};

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

if(!(file.endsWith('.prgl') || file.endsWith('.theprgl'))) {
    err('this file not .prgl or .theprgl exception');
};

console.log('succes');