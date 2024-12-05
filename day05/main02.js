const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    let rules = {};
    let cards = [];
    let onRules = true;


    lines.forEach(line => {
        if (line.length === 0) {
            onRules = false;
            return;
        }
        
        if (onRules) {
            const x = line.split('|');
            rules[x.join('|')] = -1;
            rules[R.reverse(x).join('|')] = 1;
        } else {
            cards.push(line.split(',').map(Number));
        }

        

    });
    
    return {
        rules,
        cards
    }
}

// --------------------------------------------

function run({rules, cards}) {


    const sorted = cards.map(card => {
        return R.sort((a, b) => {
            return rules[`${a}|${b}`];
        }, card);
    });
    
    U.log(cards, sorted);

    const incorrect = cards.filter((card, i) => !R.equals(sorted[i], card));

    const middles = incorrect.map(card => R.sort((a, b) => rules[`${a}|${b}`], card)).map(card => card[(card.length - 1) / 2]);

    U.log(middles);

    const result = middles.reduce(R.add);

    return result;
}

