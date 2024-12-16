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
    let map2 = [];

    map.forEach(r => {
        let nr = [];
        r.forEach(c => {
            if (c === '.') nr.push('..');
            if (c === '#') nr.push('##');
            if (c === 'O') nr.push('[]');
            if (c === '@') nr.push('@.');
        });
        nr = R.flatten(nr.map(x => x.split('')));
        map2.push(nr);
    });

    return {
        map: map2,
        moves: p2.join('').split('')
    };
}

// --------------------------------------------

function canMove(map, x, y, dx, dy) {
    const c = map[y + dy][x + dx];
    
    if (c === '.') return true;
    if (c === '#') return false;

    if ((c === '[' || c === ']') && dy === 0) return canMove(map, x + dx, y + dy, dx, dy);

    if (dy !== 0) {
        if (c === '[') {
            const m1 = canMove(map, x + dx, y + dy, dx, dy);
            const m2 = canMove(map, x + dx + 1, y + dy, dx, dy);
            return m1 && m2;
        }

        if (c === ']') {
            const m1 = canMove(map, x + dx, y + dy, dx, dy);
            const m2 = canMove(map, x + dx - 1, y + dy, dx, dy);
            return m1 && m2;
        }
    }
}

function move(map, x, y, dx, dy) {
    const c = map[y][x];
    const c1 = map[y + dy][x + dx];
    
    if ((c1 === ']' || c1 === '[') && dy === 0) move(map, x + dx, y + dy, dx, dy);

    if (dy !== 0) {
        if (c1 === '[') {
            move(map, x + dx, y + dy, dx, dy);
            move(map, x + dx + 1, y + dy, dx, dy);
        }

        if (c1 === ']') {
            move(map, x + dx, y + dy, dx, dy);
            move(map, x + dx - 1, y + dy, dx, dy);
        }
    }

    map[y][x] = '.'
    map[y + dy][x + dx] = c;
}

function score(map) {
    let result = 0;

    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            if (map[j][i] === '[') {
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

        // U.log(m);

        if (canMove(map, rx, ry, dx, dy)) {
            move(map, rx, ry, dx, dy);

            rx += dx;
            ry += dy;
        } else {
            // U.log('cant');
        }
        
        // U.log(U.matrixToTile(map));
    });

    const result = score(map);

    return result;
}

