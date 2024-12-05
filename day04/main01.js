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

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length - 3; j++) {
            const h = data[i][j] + data[i][j+1] + data[i][j+2] + data[i][j+3];
            // U.log('h ', h);
            if (h === 'XMAS' || h === 'SAMX') count++;
        }
    }

    for (let i = 0; i < data.length - 3; i++) {
        for (let j = 0; j < data[i].length; j++) {
            const v = data[i][j] + data[i+1][j] + data[i+2][j] + data[i+3][j];
            // U.log('v ', v);
            if (v === 'XMAS' || v === 'SAMX') count++;
        }
    }    

    for (let i = 0; i < data.length - 3; i++) {
        for (let j = 0; j < data[i].length - 3; j++) {
            const d1 = data[i][j] + data[i+1][j+1] + data[i+2][j+2] + data[i+3][j+3];
            // U.log('d1', d1);
            if (d1 === 'XMAS' || d1 === 'SAMX') count++;

            const d2 = data[i+3][j] + data[i+2][j+1] + data[i+1][j+2] + data[i][j+3];
            // U.log('d2', d1);
            if (d2 === 'XMAS' || d2 === 'SAMX') count++;

        }
    }

    return count;
}

