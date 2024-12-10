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

function run(data) {

    const heads = U.findAllInMatrix(data, x => x === 0);
    const ends = U.findAllInMatrix(data, x => x === 9);

    U.log('heads', heads);
    U.log('ends', ends);

    const opts = {
        acceptNeighbor: (n, s) => n.weight - s.weight === 1
    };

    let result = 0;

    for (let h = 0; h < heads.length; h++) {
        for (let e = 0; e < ends.length; e++) {
            const pathLength = U.findPath(data, heads[h], ends[e], opts).length;

            // U.log(heads[h], pathLength)

            if (pathLength > 0) result++;
        }        
    }

    

    return result;
}
