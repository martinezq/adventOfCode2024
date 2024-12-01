const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split('   '));
}

// --------------------------------------------

function run(data) {

    const list1 = data.map(x => Number(x[0]));
    const list2 = data.map(x => Number(x[1]));

    const list1s = R.sortBy(x => x, list1);
    const list2s = R.sortBy(x => x, list2);

    U.log(list1s,list2s);

    let result = 0;

    for (let i = 0; i < list1s.length; i++) {
        const dist = Math.abs(list1s[i] - list2s[i]);
        result += dist;
    }

    return result;
}

