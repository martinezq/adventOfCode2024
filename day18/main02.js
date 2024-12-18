const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(',').map(Number));
}

// --------------------------------------------

function toMap(data, time) {
    const mx = U.maxA(data.map(v => v[0]));
    const my = U.maxA(data.map(v => v[1]));

    U.log(mx, my);

    const map = R.times(j => {
        return R.times(i => 1, mx + 1);
    }, my + 1);

    for (let i = 0; i < time; i++) {
        const [x, y] = data[i];
        map[y][x] = 0;
    }

    return map;
}

function run(data) {

    // U.log('Hello');

    const map = toMap(data, 0);
    const start = [0, 0];
    const end = [map[0].length - 1, map.length - 1];

    // U.log(U.matrixToTile(map));

    for (let i = 0; i < data.length; i++) {
        const [x, y] = data[i];
        map[y][x] = 0;

        const path = U.findPath(map, start, end);

        U.log(path.length);

        if (path.length === 0) {
            return data[i].join(',');
        }
    }


}

