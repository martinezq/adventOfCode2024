const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.join('');
}

// --------------------------------------------

function run(data) {

    const ops = U.parse(data, /(mul\(\d+,\d+\))/g);

    console.table(ops);

    result = ops.map(op => {
        const nums = op.slice(4,-1).split(',').map(Number);
        return nums.reduce(R.multiply);
    }).reduce(R.add);

    return result;
}

