const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(' ').map(y => y.split('=')[1].split(',').map(Number))).map(x => ({
        p: x[0],
        v: x[1]
    }));
}

// --------------------------------------------

function step(robots, size, step) {
    // U.log(step);

    robots.forEach(({p, v}) => {
        p[0] = (p[0] + v[0]) % size[0];
        p[1] = (p[1] + v[1]) % size[1];

        if (p[0] < 0) {
            p[0] = size[0] + p[0];
        }
        if (p[1] < 0) {
            p[1] = size[1] + p[1];
        }

        if (p[0] >= size[0] || p[1] >= size[1]) {
            U.log('error', p, v)
        }
    });

    // log(robots, size);
}

function count(robots, size) {
    let q1 = 0;
    let q2 = 0;
    let q3 = 0;
    let q4 = 0;

    let hx = Math.floor(size[0] / 2);
    let hy = Math.floor(size[1] / 2);

    robots.forEach(({p}) => {
        if (p[0] < hx) {
            if (p[1] < hy) q1++;
            if (p[1] > hy) q2++;
        }
        if (p[0] > hx) {
            if (p[1] < hy) q3++;
            if (p[1] > hy) q4++;
        }
    });

    // U.log(q1, q2, q3, q4);

    return q1 * q2 * q3 * q4;
}

function toMap(robots, size) {
    let map = R.times(() => R.times(() => '0', size[0]), size[1]);

    robots.forEach(({p}) => {
        const [x, y] = p;
        if (map[y][x] === '0') map[y][x] = 0;
        map[y][x] = map[y][x] + 1;
    });

    return map;
}

function log(robots, size) {
    const map = toMap(robots, size);

    U.log(U.matrixToTile(map));
}

function calculateSymmetryScore(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0])) {
        throw new Error("Invalid matrix. Provide a non-empty 2D array.");
    }

    const rows = matrix.length;
    const cols = matrix[0].length;

    // Ensure all rows have the same number of columns
    if (!matrix.every(row => row.length === cols)) {
        throw new Error("Invalid matrix. All rows must have the same number of columns.");
    }

    const mid = Math.floor(cols / 2);
    let totalElements = 0;
    let symmetricElements = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < mid; j++) {
            const left = matrix[i][j];
            const right = matrix[i][cols - j - 1];

            totalElements++;
            if (left > 0 && right > 0) {
                symmetricElements++;
            }
        }
    }

    return symmetricElements / totalElements; // Returns a score between 0 and 1
}

function run(robots) {

    // const size = [11, 7];
    const size = [101, 103];
    
    let i = 0;
    let score = 0;

    while (true) {
        step(robots, size, i++);
        
        if (i % 100000 === 0) {
            U.log(i, score);    
        }

        const score2 = calculateSymmetryScore(toMap(robots, size));

        if (score2 > score) {
            score = score2;
            log(robots, size);
            U.log(i, score);
        }

        if (score === 1) break;
    }

    log(robots, size);

    const result = count(robots, size);

    return result;
}

