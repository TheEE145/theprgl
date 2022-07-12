const fs = require('fs');
const err = require('./err');

let
    lastargOfFuncHandler,
    arguments2,
    component,
    fragment,
    package3,
    from,
    func,
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
                        as3[package2.substring(0, package2.length - 3)] = require(`.${dir}\\${package2}`);
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

        static unArgument = function(text) {
            text = text.substring(1, text.length - 1);
            
        };
    };

    static Runtime = class {
        static sessionVars = {};
        static stack = {};

        static exec(code, isProject) {
            RunHandler.Runtime.sessionVars = {};

            code = code.split(';');
            for(let line = 0; line < code.length; line++) {
                fragment = RunHandler.Reader.trim(code[line]).split(' ');

                if(fragment[0] == '') {
                    continue;
                };

                if(fragment[0] == 'import') {
                    component = as2 = fragment[1];

                    if(fragment[2] == 'from') {
                        from = fragment[3];
                    } else {
                        err(`uknown word ${fragment[2]}, at line ${line}`);
                    };

                    if(fragment.length > 4) {
                        if(fragment[4] == 'as') {
                            if(fragment.length == 6) {
                                as2 = fragment[5];
                            };
                        } else {
                            err(`uknown word ${fragment[4]}, at line ${line}`);
                        };
                    };

                    component = component.replace('.', '\\');

                    if(from == 'prgl') {
                        component = `.\\modules\\${component}`;

                        if(fs.existsSync(component) || fs.existsSync(component + '.js')) {
                            if(fs.lstatSync(component).isDirectory()) {
                                RunHandler.Runtime.sessionVars[as2] = RunHandler.Reader.class(component, true);
                            } else {
                                RunHandler.Runtime.sessionVars[as2] = require(`../modules/${component}.js`);
                            };
                        } else {
                            err(`module ${component} not found`);
                        };
                    };

                    continue;
                };

                fragment[0] = fragment[0].split('.');

                lastargOfFuncHandler = fragment[0][fragment[0].length - 1];
                for(let char of lastargOfFuncHandler) {
                    if(char == '(') {
                        break;
                    };

                    lastargOfFuncHandler = lastargOfFuncHandler.substring(1);
                };
                
                fragment[0][fragment[0].length - 1] = fragment[0][fragment[0].length - 1].substring(0, 
                    fragment[0][fragment[0].length - 1].length - lastargOfFuncHandler.length);

                func = RunHandler.Runtime.sessionVars[fragment[0][0]];
                for(let i = 1; i < fragment[0].length; i++) {
                    package3 = fragment[0][i];
                    func = func[package3];
                };

                if(typeof func === 'undefined') {
                    err(`${fragment[0].join('.')} not defined`);
                };

                if(typeof func == 'function') {
                    func(lastargOfFuncHandler);
                };
            };
        };
    };
};

module.exports = RunHandler;