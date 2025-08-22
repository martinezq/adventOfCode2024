const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => Number(x));
}

// --------------------------------------------

function next(num) {
    let x = num * 64;
    
    x = x ^ num; // bitwise XOR
    x = x >>> 0;
    x = x % 16777216;
    num = x;
    
    x = x / 32;
    x = Math.floor(x);
    
    x = x ^ num; // bitwise XOR
    x = x >>> 0;
    x = x % 16777216;
    num = x;
    
    x = x * 2048;
    
    x = x ^ num; // bitwise XOR
    x = x >>> 0;
    x = x % 16777216;
    
    return x;
}

function nth(num, x) {
    for (let i = 0; i < x; i++) {
        num = next(num);
    }

    return num;
}

function run(data) {

    return data.map(x => nth(x, 2000)).reduce(R.add);

}

