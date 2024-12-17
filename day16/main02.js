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
    function getCost(pos0, pos1, ix = 0, iy = 1) {
        
        const costs = {
            0: 0,
            90: 1000,
            180: 2000
        }

        const dx = pos0.x - pos1.x;
        const dy = pos0.y - pos1.y;

        let p0dx, p0dy, p1dx, p1dy;

        if (pos0.parent === null) {
            p0dx = ix;
            p0dy = iy;
        } else {
            p0dx = pos0.parent.x - pos0.x;
            p0dy = pos0.parent.y - pos0.y;
        }

        if (pos1.parent === null) {
            p1dx = ix;
            p1dy = iy;
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

    const bestPath = U.findPath(grid, start, end, {
        heuristic: (n1, n2) => 0, getCost
    });

    const bestPathScore = R.last(bestPath).g;

    let result = 0;

    for (let j = 0; j < data.length; j++) {
        U.log(j, data.length);
        for (let i = 0; i < data[j].length; i++) {
            if (data[j][i] === '#') continue;

            const point = [j, i];

            const path1 = U.findPath(grid, start, point, {
                heuristic: (n1, n2) => 0, getCost
            });

            const path1Last = R.last(path1);
            const path1Score = R.last(path1)?.g || 0;

            const path2 = U.findPath(grid, point, end, {
                heuristic: (n1, n2) => 0, 
                getCost: (n1, n2) => {
                    return getCost(n1, n2, path1Last?.parent?.x - path1Last?.x, path1Last?.parent?.y - path1Last?.y)
                }
            });

            const path2Score = R.last(path2)?.g || 0;
            
            if (path1Score + path2Score === bestPathScore) {
                result++;
                data[j][i] = 'O';
            }

        }
    }

    U.log(U.matrixToTile(data));

    return result;
}

// 515 too low
// 516 is ok :)