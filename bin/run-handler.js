const fs = require('fs');
const err = require('./err');

let 
    component,
    fragment,
    from,
    as;

class RunHandler {
    static commands = {};

    static Reader = class {
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
                    component = fragment[1];

                    if(fragment[2] == 'from') {
                        from = [3];
                    } else {
                        err(`uknown word`);
                    };

                    continue;
                };
            };
        };
    };
};