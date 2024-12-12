const R = require('ramda');
const U = require('./utils');

let cache = {};

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(''));
}

// --------------------------------------------

function countNeighbors(map, code, x, y) {
    let result = 0;

    if (x > 0 && map[y][x - 1] === code) result++;
    if (x < map[0].length - 1 && map[y][x + 1] === code) result++;

    if (y > 0 && map[y - 1][x] === code) result++;
    if (y < map.length - 1 && map[y + 1][x] === code) result++;

    return result;
}

function search(map, visited, code, x, y, area = 0, peri = 0) {
    if (y < 0 || y > map.length - 1) return { area, peri };
    if (x < 0 || x > map[0].length - 1) return { area, peri };
    
    if (map[y][x] === code && visited[y][x] === '.') {
        visited[y][x] = code;

        area++;
        
        peri += 4 - countNeighbors(map, code, x, y);

        const { area: a1, peri: p1 } = search(map, visited, code, x, y + 1, area, peri);
        const { area: a2, peri: p2 } = search(map, visited, code, x, y - 1, a1, p1);
        const { area: a3, peri: p3 } = search(map, visited, code, x + 1, y, a2, p2);
        const { area: a4, peri: p4 } = search(map, visited, code, x - 1, y, a3, p3);

        return {
            area: a4,
            peri: p4
        }
    }

    return {
        area,
        peri
    };
}

function run(map) {

    let visited = U.mapMatrix(map, () => '.');

    let result = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (visited[y][x] === '.') {
                const { area, peri } = search(map, visited, map[y][x], x, y);
                const price = area * peri;
                result += price;
                U.log(area, "*", peri, "=", price);
            }
        }
    }

    // U.log(U.matrixToTile(visited));

    return result;
}

