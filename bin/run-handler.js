const fs = require('fs');
const err = require('./err');

let
    lastargOfFuncHandler,
    component,
    fragment,
    from,
    func,
    line,
    as2;

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
                let args = RunHandler.Runtime.Arguments;

                args.returnargs = [];
                args.stringnow = false;
                args.skip = false;
                args.arg = '';

                function addarg2() {
                    args.returnargs.push(args.arg);
                };

                function addarg() {
                    if(args.arg.startsWith('"') && args.arg.endsWith('"')) {
                        args.arg = args.arg.substring(1, args.arg.length - 1);
                        addarg2();
                        return;
                    };

                    args.formatedArg = args.arg.split(' ');

                    for(let i = 0; i < args.formatedArg.length; i++) {
                        if(args.formatedArg[i].startsWith('$')) {
                            args.formatedArg[i] = RunHandler.Runtime.sessionVars[args.formatedArg[i].substring(1)];
                        };
                    };

                    args.formatedArg = args.formatedArg.join(' ');

                    if(!args.formatedArg.match(/[A-Za-z_]/)) {
                        args.arg = eval(args.formatedArg.replace(/(\s+|\t+|\n+|\r+)/g, ''));
                        addarg2();
                    } else {
                        args.arg = eval(`RunHandler.Runtime.sessionVars.${args.arg}`);

                        if(args.arg === 'undefined') {
                            err(`${args.arg} not defined`);
                        };

                        addarg2();
                    };
                };

                for(let char, i = 0; i < text.length; i++) {
                    char = text[i];
                    if(char == '"') {
                        args.arg += '"';
                        if(!args.skip) {
                            args.stringnow = !args.stringnow;
                            continue;
                        };
                    };

                    if(char == ',') {
                        if(!args.stringnow) {
                            addarg();
                            args.arg = '';
                            i++;
                            continue;
                        };
                    };

                    if(char == '\\') {
                        args.skip = true;
                        continue;
                    };

                    if(args.skip) {
                        args.skip = false;
                        continue;
                    };

                    if(char == ')') {
                        if(!args.stringnow) {
                            break;
                        };
                    };

                    args.arg += char;
                };

                addarg();
            };
        };

        static exec(code, isProject, path) {
            this.sessionVars = {};
            this.line = 0;
            this.end = false;

            code = code.split(';');
            for(this.line = 0; this.line < code.length; this.line++) {
                line = this.line;
                if(this.end) {
                    break;
                };

                fragment = RunHandler.Reader.trim(code[line]).split(' ');

                if(fragment[0] == '') {
                    continue;
                };

                if(fragment[0] == 'import') {
                    component = as2 = fragment[1];

                    if(fragment[2] == 'from') {
                        from = fragment[3];
                    } else {
                        err(`uknown word ${fragment[2]}`);
                    };

                    if(fragment.length > 4) {
                        if(fragment[4] == 'as') {
                            if(fragment.length == 6) {
                                as2 = fragment[5];
                            };
                        } else {
                            err(`uknown word ${fragment[4]}`);
                        };
                    };

                    component = component.replace('.', '\\');

                    if(from == 'prgl') {
                        component = `${path}\\modules\\${component}`;

                        if(fs.existsSync(component) || fs.existsSync(component + '.js')) {
                            if(fs.lstatSync(component).isDirectory()) {
                                this.sessionVars[as2] = RunHandler.Reader.class(component, true);
                            } else {
                                this.sessionVars[as2] = require(`${component}.js`);
                            };
                        } else {
                            err(`module ${component} not found`);
                        };
                    };

                    continue;
                };

                if(fragment[0] == 'define') {
                    if(fragment[2] != '=') {
                        err(`uknown symbol, ${fragment[2]}`);
                    };

                    this.Arguments.debug(fragment.slice(3).join(' '));
                    this.sessionVars[fragment[1]] = this.Arguments.returnargs;
                    this.sessionVars[fragment[1]] = this.sessionVars[fragment[1]][0];
                    continue;
                };

                lastargOfFuncHandler = fragment[0];
                for(let i = 0; i < fragment[0].length; i++) {
                    if(fragment[0][i] == '(') {
                        fragment[0] = fragment[0].substring(0, i);
                        lastargOfFuncHandler = lastargOfFuncHandler.substring(i);
                    };
                };

                func = eval(`RunHandler.Runtime.sessionVars.${fragment[0]}`);
                if(typeof func == 'function') {
                    lastargOfFuncHandler = lastargOfFuncHandler.substring(1, lastargOfFuncHandler.length);
                    fragment.shift();

                    this.Arguments.debug(`${lastargOfFuncHandler} ${fragment.join(' ')}`);
                    func(...this.Arguments.returnargs);
                };
            };
        };
    };
};

module.exports = RunHandler;