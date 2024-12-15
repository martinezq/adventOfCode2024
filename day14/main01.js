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

function step(robots, size) {
    U.log('step');

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

function log(robots, size) {
    let map = R.times(() => R.times(() => '.', size[0]), size[1]);

    robots.forEach(({p}) => {
        const [x, y] = p;
        if (map[y][x] === '.') map[y][x] = 0;
        map[y][x] = map[y][x] + 1;
    })

    U.logm(map);
}

function run(robots) {

    // const size = [11, 7];
    const size = [101, 103];
    
    R.times(() => step(robots, size), 100);

    log(robots, size);

    const result = count(robots, size);

    return result;
}

