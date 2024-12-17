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

function calculateAngle(vector1, vector2) {
    const { x: x1, y: y1 } = vector1;
    const { x: x2, y: y2 } = vector2;

    // Check for same direction (0°)
    if (x1 === x2 && y1 === y2) {
        return 0;
    }

    // Check for opposite direction (180°)
    if (x1 === -x2 || y1 === -y2) {
        return 180;
    }

    // Otherwise, they must be perpendicular (90°)
    return 90;
}

function run(data) {

    // x is vertical and y is horizontal axis (different than usual)
    function getCost(pos0, pos1) {
        
        const costs = {
            0: 0,
            90: 1000,
            180: 2000
        }

        const dx = pos0.x - pos1.x;
        const dy = pos0.y - pos1.y;

        let p0dx, p0dy, p1dx, p1dy;

        if (pos0.parent === null) {
            p0dx = 0;
            p0dy = 1;
        } else {
            p0dx = pos0.parent.x - pos0.x;
            p0dy = pos0.parent.y - pos0.y;
        }

        if (pos1.parent === null) {
            p1dx = 0;
            p1dy = 1;
        } else {
            p1dx = pos1.parent.x - pos1.x;
            p1dy = pos1.parent.y - pos1.y;
        }

        const a0 = calculateAngle({x: dx, y: dy}, {x: p0dx, y: p0dy});
        const a1 = calculateAngle({x: dx, y: dy}, {x: p1dx, y: p1dy});

        const c0 = pos0.parent ? costs[a0] : 0;
        const c1 = pos1.parent ? costs[a1] : 0;

        if (pos0.parent === null && pos1.parent === null) {
            return 1 + costs[a0];
        } else {
            return 1 + c0 + c1;
        }
    }

    // ------------------------------------

    const start = U.findInMatrix(data, c => c === 'S');
    const end = U.findInMatrix(data, c => c === 'E');

    U.log(start, end);

    const grid = data.map(x => x.map(v => {
        if (v === '#') return 0;
        if (v === 'S') return 1;
        return 2;
    }))

    const path = U.findPath(grid, start, end, {
        heuristic: (n1, n2) => {
            return 0;
        },
        getCost,
        // closest: true
    });

    let last = R.last(path);

    const result = last.g;

    while (last) {
        U.log(last.g);
        data[last.x][last.y] = 'O';
        last = last.parent;
    }

    U.log(U.matrixToTile(data));

    return result;
}

