const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: true
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(''));
}

// --------------------------------------------

function isLooped(data) {
    // data = R.clone(data);

    let [y, x] = U.findInMatrix(data, x => x === '^')
    let dir = '^';
    let dx = 0;
    let dy = -1

    const inMap = (x, y) => x >=0 && x < data[0].length && y >=0 && y < data.length;

    while(true) {
        if (data[y][x] === '.') {
            data[y][x] = { [dir]: true};
        }

        x += dx;
        y += dy;

        if (!inMap(x, y)) break;

        if (data[y][x] === '#' || data[y][x] === 'O') {
            x -= dx;
            y -= dy;

            if (dx === -1) {
                dx = 0;
                dy = -1;
                dir = '^';
            } else if (dx === 1) {
                dx = 0;
                dy = 1;
                dir = 'v';
            } else if (dy === -1) {
                dx = 1;
                dy = 0;
                dir = '>';
            } else if (dy === 1) {
                dx = -1;
                dy = 0;
                dir = '<';
            }

            // U.log('turn');

            continue;
        }

        if (data[y][x][dir]) {
            // U.logm(data);
            return true;
        }
       
    }

    // U.logm(data);
    return false;
}

function run(data) {

    let tmp = R.clone(data);
    // tmp[14][37] = 'O';
    
    // return isLooped(tmp);

    let result = 0;

    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            // U.log(x, y);
            if (data[y][x] === '.') {
                const option = R.clone(data);
                option[y][x] = 'O';
                if (isLooped(option)) {
                    result++;
                };
            }
        }
    }
    
    return result;
}

