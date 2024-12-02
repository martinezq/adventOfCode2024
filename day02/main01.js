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

function isSafe(level) {
    let dir = level[0] > level[1] ? -1 : 1;
    for (let i = 0; i < level.length - 1; i++) {
        const cdir = level[i] > level[i + 1] ? -1 : 1;
        
        if (cdir != dir) return false;

        const dif = Math.abs(level[i] - level[i + 1]);

        if (dif < 1 || dif > 3) return false;
    }
    
    return true;
}

function run(data) {

    // U.log('Hello');

    const result = data.map(isSafe).filter(x => x).length;

    return result;
}

