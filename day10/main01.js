const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split('').map(x => isNaN(x) ? Number.POSITIVE_INFINITY : Number(x)));
}

// --------------------------------------------

function findPaths(data, [y, x], c = 0, res = 0) {

    if (c === 9 && data[y]?.[x] === c) return res + 1;
    if (data[y]?.[x] !== c) return 0;

    const r1 = findPaths(data, [y, x + 1], c + 1, res)
    const r2 = findPaths(data, [y, x - 1], c + 1, res)
    const r3 = findPaths(data, [y + 1, x], c + 1, res)
    const r4 = findPaths(data, [y - 1, x], c + 1, res)
    
    return r1 + r2 + r3 + r4;
}

function run(data) {

    const heads = U.findAllInMatrix(data, x => x === 0);
    const ends = U.findAllInMatrix(data, x => x === 9);

    U.log('heads', heads);
    U.log('ends', ends);

    let result = 0;

    for (let h = 0; h < heads.length; h++) {
        const pathCount = findPaths(data, heads[h]);

        // U.log(heads[h], pathLength)

        result += pathCount;
    }

    

    return result;
}

// 472