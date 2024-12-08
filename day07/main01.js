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

function test(result, args) {

    // U.log(result, args);
    
    if (args.length === 1) return result === args[0];

    const r1 = test(result - R.last(args), R.dropLast(1, args));
    const r2 = test(result / R.last(args), R.dropLast(1, args));
   
    return r1 || r2;
}

function run(data) {

    // U.log('Hello');

    // const result = test(data[0].result, data[0].args);

    const result = data.filter(({result, args}) => test(result, args)).reduce((p, c) => p + c.result, 0);

    return result;
}

