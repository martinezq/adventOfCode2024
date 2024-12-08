const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(line => ({
        result: Number(line.split(':')[0]),
        args: R.drop(1, line.split(':')[1].split(' ').map(Number))
    }));
}

// --------------------------------------------

function test(result, args, acc = -1, ops = []) {

    if (acc === -1) {
        acc = args[0];
        args = R.drop(1, args);
        ops = [acc];
    }

    // if (args.length === 1) U.log(result, args, ops.join(' '));
    
    if (args.length === 0) return result === acc;

    const head = R.head(args);

    const r1 = test(result, R.drop(1, args), acc + head, ops.concat(['+', head]));

    if (r1) return true;

    const r2 = test(result, R.drop(1, args), acc * head, ops.concat(['*', head]));
    
    if (r2) return true;
        
    const r3 = test(result, R.drop(1, args), Number(`${acc}${head}`), ops.concat(['||', head]));

    if(r3) return true;

    return false;
    
}

function run(data) {

    const result = data.filter(({result, args}) => test(result, args)).reduce((p, c) => p + c.result, 0);

    return result;
}

