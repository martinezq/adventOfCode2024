const R = require('ramda');
const U = require('./utils');

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

function possible(patterns, towel, offset = 0) {

    if (offset === towel.length) return true;

    let result = false;

    for (i in patterns) {
        const pattern = patterns[i];
        
        let ok = false;

        if (pattern.length <= towel.length - offset) {
        
            ok = true;

            for (let j = 0; j < pattern.length; j++) {
                if (towel[j + offset] !== pattern[j]) {
                    ok = false;
                    break;
                }
            }

        }

        if (ok) {
            const ok2 = possible(patterns, towel, offset + pattern.length);
            if (ok2) {
                return true;
            }
        }
    }

    return result;
}

function run({ patterns, towels}) {

    const list = towels.filter(towel => possible(patterns, towel));

    U.log(list.map(x => x.join('')));

    const result = list.length;

    return result;
}

