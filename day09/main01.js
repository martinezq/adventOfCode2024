const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const d = lines.map(x => x.split('').map(Number))[0];

    let line = [];
    let index = {};

    for (let i = 0; i < d.length; i++) {
        const v = (i % 2) === 0 ? i / 2 : null;
        R.times(x => { line.push(v)}, d[i]);
        
        if (i % 2 === 0) {
            index[i / 2] = i / 2;
        }

    }

    return { line };
}

// --------------------------------------------

function process(line) {
    let end = line.length - 1;
   
    for (let i = 0; i < end; i++) {
        if (line[i] !== null) continue;

        while (line[end] === null) end--;

        if (end <= i) break;

        line[i] = line[end];
        line[end] = null;
        end--;
    }
    
    
    return line;
}

function run({ line, index }) {

    // U.log('Hello');

    const processed = process(line);

    U.log(processed);

    let result = 0;

    for (let i = 0; i < processed.length; i++) {
        if (processed[i] === null) continue;
        // U.log(processed[i], i);
        result += processed[i] * i;
    }

    return result;
}
