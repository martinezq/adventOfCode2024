const R = require('ramda');
const U = require('./utils');

let best = Number.POSITIVE_INFINITY;

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    let result = [];
    
    for (let i = 0; i < lines.length; i += 4) {
        const a = lines[i].split(': ')[1].split(', ').map(R.drop(2)).map(Number);
        const b = lines[i + 1].split(': ')[1].split(', ').map(R.drop(2)).map(Number);
        const p = lines[i + 2].split(': ')[1].split(', ').map(R.drop(2)).map(Number);

        const g = {
            a,
            b,
            p
        }

        result.push(g);
    }
    
    return result;
}

// --------------------------------------------

function test(game) {
    const {a, b, p} = game;
    
    const maxa = U.minA([Math.floor(p[0] / a[0]), Math.floor(p[1] / a[1])]);
    const maxb = U.minA([Math.floor(p[0] / b[0]), Math.floor(p[1] / b[1])]);

    let best = Number.POSITIVE_INFINITY;
    let besta = Number.POSITIVE_INFINITY;
    let bestb = Number.POSITIVE_INFINITY;

    for (let ap = maxa; ap > 0; ap--) {
        for (let bp = maxb; bp > 0; bp--) {
            const x = ap * a[0] + bp * b[0];
            const y = ap * a[1] + bp * b[1];

            if (x === p[0] && y === p[1]) {
                const pressed = ap + bp;
                if (pressed < best) {
                    best = pressed;
                    besta = ap;
                    bestb = bp;
                }

                break;
            }
        }
    }

    const result = besta * 3 + bestb;

    return isFinite(result) ? result : 0;

}

function run(data) {

    // U.log('Hello');

    const result = data.map(test).reduce(R.add);

    return result;
}

