const R = require('ramda');
const U = require('./utils');
const fs = require('fs');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const x = lines.map(x => [' ', ' ', ...x.split(''), ' ', ' ']);

    return [
        R.times(() => ' ', lines[0].length + 4),
        R.times(() => ' ', lines[0].length + 4),
        ...x,
        R.times(() => ' ', lines[0].length + 4),
        R.times(() => ' ', lines[0].length + 4)
    ];
}

// --------------------------------------------


function search(map, visited, code, x, y, area = 0, peri = 0, lines = {}) {
    if (y < 0 || y > map.length - 1) return { area, peri, lines };
    if (x < 0 || x > map[0].length - 1) return { area, peri, lines };

    if (map[y][x] === code && visited[y][x] === '.') {
        visited[y][x] = code;

        area++;

        const newLines = [
            [[x, y, x + 1, y], 1],
            [[x, y, x, y + 1], 1],
            [[x + 1, y, x + 1, y + 1], -1],
            [[x, y + 1, x + 1, y + 1], -1]
        ]

        newLines.forEach(([line, dir]) => {
            if (lines[line]) {
                lines[line] = 0;
            } else {
                lines[line] = dir;
            }
        });

        const { area: a1, peri: p1 } = search(map, visited, code, x, y + 1, area, peri, lines);
        const { area: a2, peri: p2 } = search(map, visited, code, x, y - 1, a1, p1, lines);
        const { area: a3, peri: p3 } = search(map, visited, code, x + 1, y, a2, p2, lines);
        const { area: a4, peri: p4 } = search(map, visited, code, x - 1, y, a3, p3, lines);

        return {
            area: a4,
            peri: p4,
            lines
        }
    }

    const linesCount = R.values(lines).reduce(R.add);

    return {
        area,
        peri: linesCount,
        lines
    };
}

/**
 * Merges vectors into straight lines.
 * Vectors are represented as [startx, starty, endx, endy].
 * Only horizontal and vertical vectors are supported.
 */
function mergeVectors(vectors) {
    // Group vectors by orientation (horizontal or vertical)
    let horizontal = [];
    let vertical = [];

    for (let [startx, starty, endx, endy, d] of vectors) {
        if (starty === endy) {
            horizontal.push([startx, starty, endx, endy, d]);
        } else if (startx === endx) {
            vertical.push([startx, starty, endx, endy, d]);
        }
    }

    // Merge horizontal vectors
    horizontal.sort((a, b) => a[1] - b[1] || a[0] - b[0]); // Sort by y, then x
    horizontal = merge(horizontal, 0); // Merge along x-axis

    // Merge vertical vectors
    vertical.sort((a, b) => a[0] - b[0] || a[1] - b[1]); // Sort by x, then y
    vertical = merge(vertical, 1); // Merge along y-axis

    // Combine and return
    return [...horizontal, ...vertical];
}

/**
 * Helper function to merge aligned vectors.
 * @param {Array} lines - List of vectors sorted along the primary axis.
 * @param {number} axis - Primary axis (0 for x, 1 for y).
 */
function merge(lines, axis) {
    const result = [];

    for (let line of lines) {
        if (!result.length || !areConnected(result[result.length - 1], line, axis)) {
            result.push(line);
        } else {
            const prev = result[result.length - 1];
            result[result.length - 1] = mergeTwo(prev, line, axis);
        }
    }

    return result;
}

/**
 * Checks if two vectors are connected along a given axis.
 * @param {Array} line1
 * @param {Array} line2
 * @param {number} axis
 */
function areConnected(line1, line2, axis) {
    if (axis === 0) {
        // Horizontal: same y, x2 of line1 touches x1 of line2
        return line1[1] === line2[1] && line1[2] === line2[0] && line1[4] === line2[4];
    } else {
        // Vertical: same x, y2 of line1 touches y1 of line2
        return line1[0] === line2[0] && line1[3] === line2[1] && line1[4] === line2[4];
    }
}

/**
 * Merges two connected vectors into one.
 * @param {Array} line1
 * @param {Array} line2
 * @param {number} axis
 */
function mergeTwo(line1, line2, axis) {
    if (axis === 0) {
        // Horizontal
        return [line1[0], line1[1], line2[2], line2[3], line2[4]];
    } else {
        // Vertical
        return [line1[0], line1[1], line2[2], line2[3], line2[4]];
    }
}

function countSides(allLines) {
    let lines = [];
    
    R.keys(allLines)
        .filter(k => allLines[k] !== 0)
        .forEach(k => lines.push( [...(k.split(',').map(Number)), allLines[k]]))
    
    const result = mergeVectors(lines);
    
    return result.length;
    
}

function run(map) {

    let visited = U.mapMatrix(map, () => '.');

    let result = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (visited[y][x] === '.' && map[y][x] !== ' ') {
                const { area, peri, lines } = search(map, visited, map[y][x], x, y);
                const sides = countSides(lines);
                const price = area * sides;
                result += price;
                U.log(area, "*", sides, "=", price);
            }
        }
    }


    return result;
}
