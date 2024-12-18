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

function run({ regs, program }) {

    let bestOp = 0;

    function executeWithA(init) {
        let a = init;
        let b = regs[1];
        let c = regs[2];
        let out = [];
        let op = 0;

        const decodeOperand = (o) => {
            if (o <= 3) return o;

            switch (o) {
                case 4: return a;
                case 5: return b;
                case 6: return c;
            }

            return null;
        }

        const operations = {
            0: (o, co, p) => {
                a = (a / (1 << co)) >>> 0;
                return p + 2;
            },
            1: (o, co, p) => {
                b = (b ^ o) >>> 0;
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
                b = (b ^ c) >>> 0;
                return p + 2;
            },
            5: (o, co, p) => {
                out.push(co % 8);
                if (program[op++] !== co % 8) return -1;
                return p + 2;
            },
            6: (o, co, p) => {
                b = (a / (1 << co)) >>> 0;
                return p + 2;
            },
            7: (o, co, p) => {
                c = (a / (1 << co)) >>> 0;
                return p + 2;
            }        
        };

        let log = [];

        for (let p = 0; p < program.length;) {

            if (b < 0 || c < 0) throw "error";

            const cmd = operations[program[p]];
            const co = decodeOperand(program[p + 1]);

            if (cmd) {
                p = cmd(program[p + 1], co, p);
                
                if (p < 0) {
                    if (op > bestOp) {
                        bestOp = op;
                        // U.log("op", op, "a", init);
                        U.log('0o' + init.toString(8), init, op);
                    //    U.log('   p =', p, ', a =', a, ', b =', b, ', c =', c);
                    }
                    return false;
                }
            } else {
                throw "Unknown operation " + program[p];
            }

        }

        return op === program.length;
    }

    let ast = 0;

    while (true) {
        
        
        let a = 258394985014171;
        // let a = ast + 0o522621633;

        // if (a % 10000000 === 0) U.log(a);

        if (executeWithA(a)) {
            return a;
        }


        ast += 1
    }

    }

// 14146000000000 too low
// 14146100470683 too low
// 153259554317211 too low
// 258394985014171 
