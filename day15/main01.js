const R = require('ramda');
const U = require('./utils');

const deltas = {
    '>': { dx: 1, dy: 0 },
    '<': { dx: -1, dy: 0 },
    '^': { dx: 0, dy: -1 },
    'v': { dx: 0, dy: 1 }
};

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const brk = lines.findIndex(l => l.length === 0);
    
    const p1 = R.take(brk, lines);
    const p2 = R.drop(brk + 1, lines);

    const map = p1.map(x => x.split(''));

    return {
        map,
        moves: p2.join('').split('')
    };
}

// --------------------------------------------

function canMove(map, x, y, dx, dy) {
    const c = map[y + dy][x + dx];
    
    if (c === '.') return true;
    if (c === '#') return false;

    if (c === 'O') return canMove(map, x + dx, y + dy, dx, dy);
}

function move(map, x, y, dx, dy) {
    const c = map[y][x];
    const c1 = map[y + dy][x + dx];
    
    if (c1 === 'O') move(map, x + dx, y + dy, dx, dy);

    map[y][x] = '.'
    map[y + dy][x + dx] = c;
}

function score(map) {
    let result = 0;

    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            if (map[j][i] === 'O') {
                const v = 100 * j + i;
                result += v;
            }
        }
    }
    
    return result;
}

function run({map, moves}) {

    let rx, ry;

    // U.log(U.matrixToTile(map));

    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            if (map[j][i] === '@') {
                rx = i;
                ry = j;
                break;
            }
        }
    }

    moves.forEach(m => {

        const { dx, dy } = deltas[m];

        if (canMove(map, rx, ry, dx, dy)) {
            move(map, rx, ry, dx, dy);

            rx += dx;
            ry += dy;
        } else {
            // U.log('cant');
        }

        // U.log(m);
        // U.log(U.matrixToTile(map));
    });

    const result = score(map);

    return result;
}

