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
        const p = lines[i + 2].split(': ')[1].split(', ').map(R.drop(2)).map(Number).map(x => x + 10000000000000);

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

function test2(game) {
    U.log(game);
    const {a, b, p} = game;
    
    let minb = 0;
    let maxb = U.minA([Math.floor(p[0] / b[0]), Math.floor(p[1] / b[1])]);

    let best = Number.POSITIVE_INFINITY;

    for (let bp = minb; bp <= maxb; bp += 1) {

        const dx = p[0] - bp * b[0];
        const dy = p[1] - bp * b[1];

        const apf1 = dx / a[0];
        const apf2 = dy / a[1];
        const apf = apf1; 
        const price = 3 * apf1 + bp;

        if (bp % 1 === 0) {
            U.log(bp, apf1, apf2, price);
        }

        if ((dx % a[0] === 0) && (dy % a[1] === 0) && (dx / a[0] === dy / a[1])) {
            const ap = dx / a[0];
            // U.log(dx, dy);
            

            const x = ap * a[0] + bp * b[0];
            const y = ap * a[1] + bp * b[1];

            if (price < best) {
                best = price;
                U.log(bp, apf, best);
                break;
            }
        }

        

    }
    
    return isFinite(best) ? best : 0;

}

function test(game) {
    U.log(game);
    const {a, b, p} = game;
    
    const maxb = U.minA([Math.floor(p[0] / b[0]), Math.floor(p[1] / b[1])]);
    
    const numerator = p[0]*a[1] - p[1]*a[0];
    const denominator = b[0]*a[1] - b[1]*a[0];
    
    // Check if denominator is zero to avoid division by zero
    if (denominator === 0) {
        return 0; // No solution if lines are parallel in a way that can't solve for bp
    }
    
    const bp = numerator / denominator;

    // Verify bp is an integer and within bounds
    if (Number.isInteger(bp) && bp >= 0 && bp <= maxb) {
        const dx = p[0] - bp * b[0];
        const dy = p[1] - bp * b[1];

        if (dx % a[0] === 0 && dy % a[1] === 0 && (dx / a[0]) === (dy / a[1])) {
            const ap = dx / a[0];
            const price = 3 * ap + bp;
            return price;
        }
    }
    
    return 0;
}

function run(data) {

    // U.log('Hello');

    const result = data.map(test).reduce(R.add);
    // const result = test(data[0]);

    return result;
}

