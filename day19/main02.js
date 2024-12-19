const R = require('ramda');
const U = require('./utils');

let cache = {};

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return {
        patterns: lines[0].split(', ').map(x => x.split('')),
        towels: R.drop(2, lines).map(x => x.split(''))
    }
}

// --------------------------------------------

function countPossible(patterns, towel) {

    const cached = cache[towel];

    if (cached) {
        return cached;
    }

    if (towel.length === 0) {
        return 1;
    }

    let result = false;

    for (i in patterns) {
        const pattern = patterns[i];
        
        let ok = false;

        if (pattern.length <= towel.length) {
        
            ok = true;

            for (let j = 0; j < pattern.length; j++) {
                if (towel[j] !== pattern[j]) {
                    ok = false;
                    break;
                }
            }

        }

        if (ok) {
            const result2 = countPossible(patterns, towel.slice(pattern.length));

            result += result2;
        }
    }

    cache[towel] = result;

    return result;
}

function run({ patterns, towels}) {

    const list = towels.map(towel => countPossible(patterns, towel));

    const result = list.reduce(R.add);

    return result;
}

