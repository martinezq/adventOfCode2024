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
    const map2 = R.groupBy(x => x, list2);
    const map22 = R.mapObjIndexed((v, k) => v.length, map2); 

    U.log(list1s, map22);

    let result = 0;

    for (let i = 0; i < list1s.length; i++) {
        const dist = list1s[i] * (map22["" + list1s[i]]) || 0;
        result += dist;
    }

    return result;
}

