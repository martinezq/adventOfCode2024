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

function blink(line) {
    let result = [];

    line.forEach(stone => {
        if (stone === 0) {
            result.push(1);
            return;
        }

        const digits = String(stone).split('').map(Number);

        if (digits.length % 2 === 0) {
            const a = Number(digits.slice(0, digits.length / 2).join(''));
            const b = Number(digits.slice(digits.length / 2, digits.length).join(''));;

            result.push(a);
            result.push(b);

            return;
        }

        result.push(stone * 2024);
    });

    return result;
}

function run(line) {

    // U.log('Hello');

    for (let i = 0; i < 25; i++) {
        line = blink(line);
        U.log(i, line);
    }

    const result = line.length;
    
    return result;
}

