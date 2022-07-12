#!/usr/bin/env node
const process = require('process');

let args = [];
for(let i = 2; i < process.argv.length; i++) {
    args.push(process.argv[i]);
};

console.log(args);