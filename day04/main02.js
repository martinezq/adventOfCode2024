const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines;
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    let count = 0;

    for (let i = 0; i < data.length - 2; i++) {
        for (let j = 0; j < data[i].length - 2; j++) {
            const d1 = data[i][j] + data[i+1][j+1] + data[i+2][j+2];
            const d2 = data[i+2][j] + data[i+1][j+1] + data[i][j+2];
            // U.log(d1, d2);
            if ((d1 === 'MAS' || d1 === 'SAM') && (d2 === 'MAS' || d2 === 'SAM')) count++;

        }
    }

    return count;
}

