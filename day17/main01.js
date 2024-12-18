const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const regs = R.take(3, lines).map(x => Number(x.split(': ')[1]));
    const program = lines[4].split(': ')[1].split(',').map(Number)
    
    return {
        regs,
        program
    }
}

// --------------------------------------------

function run({regs, program}) {

    let a = regs[0];
    let b = regs[1];
    let c = regs[2];
    let out = [];

    const decodeOperand = (o) => {
        if (o <= 3) return o;

        switch(o) {
            case 4: return a;
            case 5: return b;
            case 6: return c;
        }

        return null;
    }

    const operations = {
        0: (o, co, p) => {
            a = Math.floor(a / Math.pow(2, co));
            return p + 2;
        },
        1: (o, co, p) => {
            b = b ^ o;
            return p + 2;
        },
        2: (o, co, p) => {
            b = co % 8;
            return p + 2;
        },
        3: (o, co, p) => {
            if (a !== 0) return o;
            return p + 2;
        },
        4: (o, co, p) => {
            b = b ^ c;
            return p + 2;
        },
        5: (o, co, p) => {
            out.push(co % 8);
            return p + 2;
        },
        6: (o, co, p) => {
            b = Math.floor(a / Math.pow(2, co));
            return p + 2;
        },
        7: (o, co, p) => {
            c = Math.floor(a / Math.pow(2, co));
            return p + 2;
        }        
    };

    for (let p = 0; p < program.length;) {
        const cmd = operations[program[p]];
        const co = decodeOperand(program[p + 1]);

        if (cmd) {
            p = cmd(program[p + 1], co, p);
            U.log('p = ', p, ', a =', a, ', b =', b, ', c =', c);
        } else {
            //throw "Unknown operation " + program[p];
        }
        
    }

    const result = out.join(',');

    return result;
}

