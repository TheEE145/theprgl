const fs = require('fs');
const err = require('./err');

let
    component,
    fragment,
    from,
    as2;

class RunHandler {
    static Reader = class {
        static class = function(dir, isSystem) {
            let as3 = {};
            console.log(fs.readdirSync(dir));
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
    };

    static Runtime = class {
        static sessionVars = {};
        static stack = {};

        static exec(code, isProject) {
            RunHandler.Runtime.sessionVars = {};

            code = code.split(';');
            for(let line = 0; line < code.length; line++) {
                fragment = code[line].split(' ');

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

                        if(
                            fs.existsSync(component) || fs.existsSync(component + '.js')
                        ) {
                            if(
                                fs.lstatSync(component).isDirectory() || fs.lstatSync(component + 'js').isDirectory()
                            ) {
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
            };

            console.log(RunHandler.Runtime.sessionVars);
        };
    };
};

module.exports = RunHandler;