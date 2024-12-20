const R = require('ramda');
const U = require('./utils');

cache = {};

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: true
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(''));
}

// --------------------------------------------

function run(map) {

    // U.log('Hello');

    const start = U.findInMatrix(map, x => x === 'S');
    const end = U.findInMatrix(map, x => x === 'E');

    U.log(start, end);

    map = U.mapMatrix(map, (v, i, j) => {
        if (v === '#') return 0;
        return 1;
    })

    // U.log(U.matrixToTile(map));

    const maxTime = U.findPath(map, start, end).length;
    let bestTime = maxTime;
    let count = 0

    U.log('maxTime', maxTime);

    for (let j = 1; j < map.length - 1; j++) {
        U.log(j, '/', map.length - 2);
        for (let i = 1; i < map[j].length - 1; i++) {
            const v = map[j][i];
            // U.log(i);
            if (v === 0) {
                continue;
            }

            // U.log(i, j, v);
            
            const cheatStart = [j, i];
            
            const c1 = cache[start]?.[cheatStart];

            let path1Len = 0;

            if (c1 !== undefined) {
                path1Len = c1;
            } else {
                const path1 = U.findPath(map, start, cheatStart);
                cache[start] = cache[start] || {};
                cache[start][cheatStart] = path1.length;
                path1Len = path1.length;
            }


            if (path1Len === 0 && (j !== start[0] | i !== start[1])) continue;
            
            const cheatMaxDist = 20;
            const level = 100;

            for (let j2 = Math.max(1, j - cheatMaxDist); j2 < Math.min(map.length - 1, j + cheatMaxDist + 1); j2++) {
                for (let i2 = Math.max(1, i - cheatMaxDist); i2 < Math.min(map[j2].length - 1, i + cheatMaxDist + 1); i2++) {
                    // U.log(j, i, j2, i2);
                    if (map[j2][i2] === 0) continue;
                    
                    const cheatEnd = [j2, i2];
                    const cheatDist = U.distanceManhattan(cheatStart, cheatEnd);

                    if (cheatDist > 0 && cheatDist <= cheatMaxDist) {
                        // U.log('ok');

                        if (path1Len + cheatDist > maxTime - level) continue;
                        
                        const c2 = cache[cheatEnd]?.[end];
                        let path2Len;

                        if (c2 !== undefined) {
                            path2Len = c2;
                        } else {
                            const path2 = U.findPath(map, cheatEnd, end);
                            cache[cheatEnd] = cache[cheatEnd] || {};
                            cache[cheatEnd][end] = path2.length;
                            path2Len = path2.length;
                        }

                        if (path2Len === 0 && (j2 !== end[0] || i2 !== end[1])) continue;
                        
                        // U.log(U.matrixToTile(U.mapMatrix(map, x => x === 0 ? '#' : '.')));
            
                        const time = path1Len + path2Len + cheatDist;
            
                        if (maxTime - time >= level) {
                            // U.log(i, j, maxTime - time);
                            // U.log(cheatStart, cheatEnd);
                            bestTime = time;
                            count++;
                        }
                    }
                }
            }



            
        }
    };

    return count;

}

// 18969 too low
// 978731 too low
// 983905