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

function run(data) {

    let [y, x] = U.findInMatrix(data, x => x === '^')
    let dx = 0;
    let dy = -1

    U.log('guard', x, y);

    let count = 1;

    const inMap = (x, y) => x >=0 && x < data[0].length && y >=0 && y < data.length;

    while(true) {
        x += dx;
        y += dy;

        if (!inMap(x, y)) break;

        if (data[y][x] === '#') {
            x -= dx;
            y -= dy;

            if (dx === -1) {
                dx = 0;
                dy = -1;
            } else if (dx === 1) {
                dx = 0;
                dy = 1;
            } else if (dy === -1) {
                dx = 1;
                dy = 0
            } else if (dy === 1) {
                dx = -1;
                dy = 0
            }

            U.log('turn', dx, dy);

            continue;
        }

        if (data[y][x] === '.') {
            data[y][x] = 'X';
            count++;
        }

        U.log(x, y);
        
    }

    U.logm(data);
    
    return count;
}

