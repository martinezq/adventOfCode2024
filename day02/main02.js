const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(' ').map(Number));
}

// --------------------------------------------

function isSafe(l) {
    let safe = true;

    for (let i = 0; i < l.length - 1; i++) {
    
        const dirNotOk = i > 0 ? Math.sign(l[i-1] - l[i]) !== Math.sign(l[i] - l[i+1]) : Math.sign(l[i] - l[i+1]) !== Math.sign(l[i+1] - l[i+2]);
        const diffNotOk = !(0 < Math.abs(l[i] - l[i+1]) && Math.abs(l[i] - l[i+1])< 4);

        // U.log(dirNotOk, diffNotOk, Math.abs(l[i] - l[i+1]));

        if (dirNotOk || diffNotOk) {
            safe = false;
            break;
        };
    }
    
    U.log(l, safe);

    return safe;
}

function run(data) {

    // U.log('Hello');

    const result = data.map(x => {
        if (isSafe(x)) {
            return true;
        }

        for (let i = 0; i < x.length; i++) {
            if (isSafe(R.remove(i, 1, x))) {
                return true;
            }
        }

        return false;
    }).filter(x => x).length;

    return result;
}

