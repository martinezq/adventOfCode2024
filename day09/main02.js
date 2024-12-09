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
   
    for (let fi = line.length - 1; fi > 0; fi--) {
        let id = line[fi];
        let len = 0;
        
        if (line[fi] === null) continue;
        while (line[fi--] === id) len++;

        fi += 2;

        let i = 0;
        let len2 = 0;


        while (len2 < len && i < fi) {
            len2 = 0;

            while (line[i++] !== null);
            i--;
                            
            while (line[i++] === null) len2++;
            i--;
        }

        i -= len2;

        if (len2 < len) continue;

        if (i >= fi) {
            continue;
        }

        // U.log(id, len, i, len2);

        for (let j = 0; j < len; j++) {
            line[i + j] = line[fi + j];
            line[fi + j] = null;
        }

        // U.log(line);

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

// 6301361979006 too high
// 6301361958738
