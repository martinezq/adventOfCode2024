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

function findAntennas(data) {
    let result = {};

    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            const p = data[y][x];
            if (p !== '.' && p !== '#') {
                result[p] = result[p] || [];
                result[p].push({x, y});
            }
        }
    }

    return result;
}

function findAntinodes(a1, a2, data) {
    const dx = a1.x - a2.x;
    const dy = a1.y - a2.y;

    // U.log(a1, a2, dx, dy);
    let nodes = [];

    let x = a1.x;
    let y = a1.y;

    while (isInMap({x, y}, data)) {
        nodes.push({x, y});
        x += dx;
        y += dy;
    }

    x = a2.x;
    y = a2.y;

    while (isInMap({x, y}, data)) {
        nodes.push({x, y});
        x -= dx;
        y -= dy;
    }


    return nodes;
}

function isInMap({x, y}, data) {
    if (x < 0 || y < 0) return false;
    if (x > data[0].length - 1 || y > data.length - 1) return false;
    return true;
}

function run(data) {

    // U.log('Hello');
    const antennas = findAntennas(data);
    const types = R.values(antennas);

    const nodes = [];

    types.forEach(positions => {
        for (let p1 = 0; p1 < positions.length - 1; p1++) {
            for (let p2 = p1 + 1; p2 < positions.length; p2++) {
                const foundNodes = findAntinodes(positions[p1], positions[p2], data);
                const nodesInMap = foundNodes.filter(n => isInMap(n, data));
                nodesInMap.forEach(n => nodes.push(n));                
            }
        }
    });

    const selectedNodes = R.uniq(nodes);

    const result = selectedNodes.length;

    return result;
}

