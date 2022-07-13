const fs = require('fs');
const err = require('./err');

class RunHandler {
    static Reader = class {
        static class = function(dir, isSystem) {
            let as3 = {};
            for(let package2 of fs.readdirSync(dir)) {
                if(fs.lstatSync(`${dir}\\${package2}`).isDirectory()) {
                    as3[package2] = RunHandler.Reader.class(`${dir}\\${package2}`, isSystem);
                } else {
                    if(isSystem) {
                        as3[package2.substring(0, package2.length - 3)] = require(`${dir}\\${package2}`);
                    };
                };
            };

            return as3;
        };

        static trim = function(text) {
            for(let variant of [' ', '\n', '\t', '\r']) {
                if(text[0] == variant) {
                    text = text.substring(1);
                    return RunHandler.Reader.trim(text);
                };
            };

            return text;
        };
    };

    static Runtime = class {
        static sessionVars = {};
        static stack = {};
        static line;
        static end;

        static Arguments = class {
            static formatedArg;
            static returnargs;
            static stringnow;
            static skip;
            static arg;

            static debug(text) {
                this.returnargs = [];
                this.stringnow = false;
                this.skip = false;
                this.arg = '';

                let this2 = RunHandler.Runtime.Arguments;

                function addarg2() {
                    this2.returnargs.push(this2.arg);
                };

                function addarg() {
                    if(this2.arg.startsWith('"') && this2.arg.endsWith('"')) {
                        this2.arg = this2.arg.substring(1, this2.arg.length - 1);
                        addarg2();
                        return;
                    };

                    this2.formatedArg = this2.arg.split(' ');

                    for(let i = 0; i < this2.formatedArg.length; i++) {
                        if(this2.formatedArg[i].startsWith('$')) {
                            this2.formatedArg[i] = eval(`RunHandler.Runtime.sessionVars.${this2.formatedArg[i].substring(1)}`);
                        };
                    };

                    this2.formatedArg = this2.formatedArg.join(' ');

                    if(!this2.formatedArg.match(/[A-Za-z_]/)) {
                        this2.arg = eval(this2.formatedArg.replace(/(\s+|\t+|\n+|\r+)/g, ''));
                        addarg2();
                    } else {
                        this2.arg = eval(`RunHandler.Runtime.sessionVars.${this2.arg}`);

                        if(this2.arg === 'undefined') {
                            err.error(`${this2.arg} not defined`);
                        };

                        addarg2();
                    };
                };

                for(let char, i = 0; i < text.length; i++) {
                    char = text[i];
                    if(char == '"') {
                        this.arg += '"';
                        if(!this.skip) {
                            this.stringnow = !this.stringnow;
                            continue;
                        };
                    };

                    if(char == ',') {
                        if(!this.stringnow) {
                            addarg();
                            this.arg = '';
                            i++;
                            continue;
                        };
                    };

                    if(char == '\\') {
                        this.skip = true;
                        continue;
                    };

                    if(this.skip) {
                        this.skip = false;
                        continue;
                    };

                    if(char == ')') {
                        if(!this.stringnow) {
                            break;
                        };
                    };

                    this.arg += char;
                };

                addarg();
            };
        };

        static exec(code, isProject, path, args, attributes) {
            this.sessionVars = {
                argv: [...args],
                true: true,
                false: false
            };

            this.line = 0;
            this.end = false;

            this.stack.force = attributes.find(e => {
                return e == 'force';
            }) == 'force';

            code = code.split(';');
            for(this.line = 0; this.line < code.length; this.line++) {
                this.stack.line = this.sessionVars.line = this.line;
                if(this.end) {
                    break;
                };

                this.stack.fragment = RunHandler.Reader.trim(code[this.stack.line]).split(' ');

                if(this.stack.fragment[0] == '') {
                    continue;
                };

                if(this.stack.fragment[0] == 'import') {
                    this.stack.component = this.stack.as2 = this.stack.fragment[1];

                    if(this.stack.fragment[2] == 'from') {
                        this.stack.from = this.stack.fragment[3];
                    } else {
                        err.error(`uknown word ${this.stack.fragment[2]}`);
                    };

                    if(this.stack.fragment.length > 4) {
                        if(this.stack.fragment[4] == 'as') {
                            if(this.stack.fragment.length == 6) {
                                this.stack.as2 = this.stack.fragment[5];
                            };
                        } else {
                            err.error(`uknown word ${this.stack.fragment[4]}`);
                        };
                    } else {
                        if(this.stack.as2.split('.').length > 1) {
                            this.stack.as2 = this.stack.as2.split('.');
                            this.stack.as2 = this.stack.as2[this.stack.as2.length - 1];
                        };
                    };

                    this.stack.component = this.stack.component.replace('.', '\\');

                    if(this.stack.from == 'prgl') {
                        this.stack.component = `${path}\\modules\\${this.stack.component}`;

                        if(fs.existsSync(this.stack.component) || fs.existsSync(this.stack.component + '.js')) {
                            if(fs.lstatSync(this.stack.component).isDirectory()) {
                                this.sessionVars[this.stack.as2] = RunHandler.Reader.class(this.stack.component, true);
                            } else {
                                this.sessionVars[this.stack.as2] = require(`${this.stack.component}.js`);
                            };
                        } else {
                            err.error(`module ${this.stack.component} not found`);
                        };
                    };

                    continue;
                };

                if((this.stack.fragment[0] == 'define') || (this.stack.fragment[0] == 'set')) {
                    if(!this.stack.force) {
                        if(this.stack.fragment[0] == 'define') {
                            err.warn('"define" is deprecated, use "set" instead');
                        };
                    };

                    if(this.stack.fragment[2] != '=') {
                        err.error(`uknown symbol, ${this.stack.fragment[2]}`);
                    };

                    this.stack.fragment[3] = this.stack.fragment.slice(3).join(' ');

                    this.stack.array = false;
                    if(this.stack.fragment[3].startsWith('[')) {
                        if(this.stack.fragment[3].endsWith(']')) {
                            this.stack.fragment[3] = this.stack.fragment[3]
                                .substring(1, this.stack.fragment[3].length - 1);
                            
                            this.stack.array = true;
                        };
                    };

                    this.Arguments.debug(this.stack.fragment[3]);
                    this.sessionVars[this.stack.fragment[1]] = this.Arguments.returnargs;
                    
                    if(!this.stack.array) {
                        this.sessionVars[this.stack.fragment[1]] = this.sessionVars[this.stack.fragment[1]][0];
                    };

                    continue;
                };

                this.stack.laoffh = this.stack.fragment[0];
                for(let i = 0; i < this.stack.fragment[0].length; i++) {
                    if(this.stack.fragment[0][i] == '(') {
                        this.stack.fragment[0] = this.stack.fragment[0].substring(0, i);
                        this.stack.laoffh = this.stack.laoffh.substring(i);
                    };
                };

                this.stack.func = eval(`RunHandler.Runtime.sessionVars.${this.stack.fragment[0]}`);
                if(typeof this.stack.func == 'function') {
                    this.stack.laoffh = this.stack.laoffh.substring(1, this.stack.laoffh.length);
                    this.stack.fragment.shift();

                    this.Arguments.debug(`${this.stack.laoffh} ${this.stack.fragment.join(' ')}`);
                    this.stack.func(...this.Arguments.returnargs);
                };
            };
        };
    };
};

module.exports = RunHandler;