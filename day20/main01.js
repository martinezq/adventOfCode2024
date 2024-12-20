const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(''));
}

// --------------------------------------------

function run(map) {

    // U.log('Hello');

    const start = U.findInMatrix(map, x => x === 'S');
    const end = U.findInMatrix(map, x => x === 'E');

    U.log(start, end);

    map = U.mapMatrix(map, (v, i, j) => {
        if (v === '#') return 0;
        return 1;
    })

    // U.log(U.matrixToTile(map));

    const maxTime = U.findPath(map, start, end).length;
    let bestTime = maxTime;
    let count = 0

    U.log('maxTime', maxTime);

    for (let j = 1; j < map.length - 1; j++) {
        U.log(j, '/', map.length);
        for (let i = 1; i < map[j].length - 1; i++) {
            const v = map[j][i];
            // U.log(i);
            if (v > 0) {
                continue;
            }

            // U.log(i, j, v);
            map[j][i] = 1;
            
            // U.log(U.matrixToTile(U.mapMatrix(map, x => x === 0 ? '#' : '.')));

            const time = U.findPath(map, start, end).length;

            if (maxTime - time > 0) {
                // U.log(i, j, maxTime - time);
                bestTime = time;
                count++;
            }

            map[j][i] = v;
        }
    };

    return count;

}

// 1303 too low
// 1323 ok