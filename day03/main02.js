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

    const ops = U.parse(data, /(mul\(\d+,\d+\))|(do\(\))|(don't\(\))?/g).filter(x => x.length > 0);

    console.table(ops);

    let enabled = true;

    result = ops.map(op => {
        const code = op.split('(')[0];
        
        if (code === 'do') {
            enabled = true;
        }
        if (code === 'don\'t') {
            enabled = false;
        }

        if (code === 'mul' && enabled) {
            const nums = op.slice(4,-1).split(',').map(Number);
            return nums.reduce(R.multiply);
        }

        return 0;
    }).reduce(R.add);

    return result;
}

