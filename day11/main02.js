const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines[0].split(' ').map(Number);
}

// --------------------------------------------

function blink(set) {
    let result = {};
    
    R.keys(set).forEach(stone => {
        stone = Number(stone);

        if (stone === 0) {
            result[1] = (result[1] || 0) + set[0];
            return;
        }

        const digits = String(stone).split('').map(Number);

        if (digits.length % 2 === 0) {
            const a = Number(digits.slice(0, digits.length / 2).join(''));
            const b = Number(digits.slice(digits.length / 2, digits.length).join(''));;

            result[a] = (result[a] || 0) + set[stone];
            result[b] = (result[b] || 0) + set[stone];

            return;
        }

        result[stone * 2024] = (result[stone * 2024] || 0) + set[stone];
    });

    return result;
}

function run(line) {

    // U.log('Hello');

    let set = {};

    line.forEach(s => {
        set[s] = set[s] + 1 || 1
    });

    U.log(set);

    for (let i = 0; i < 75; i++) {
        set = blink(set);
        U.log(i);
    }

    const result = R.values(set).reduce(R.add);
    
    return result;
}

