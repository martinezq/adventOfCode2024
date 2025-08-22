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

function calculatePrices(num) {
    let result = [];
    result.push(num % 10);
    for (let i = 0; i < 2000; i++) {
        num = next(num);
        result.push(num % 10);
    }

    return result;
}

function calculateDeltas(prices) {
    return prices.map((p, i) => i > 0 ? p - prices[i - 1] : null);
}

function calculateScore(dataSet, seq) {
    return dataSet.map(({ prices, deltas }) => {
        for (let i = 1; i < deltas.length - 3; i++) {
            if (deltas[i] === seq[0] && deltas[i + 1] === seq[1] && deltas[i + 2] === seq[2] && deltas[i + 3] === seq[3]) {
                return prices[i + 3];
            }
        }

    }).filter(x => x !== undefined).reduce(R.add);;
}

function findSequence(data) {
    const allDeltas = data.map(num => calculateDeltas(calculatePrices(num))).map(x => R.drop(1, x));

    let allSeqsMap = {};

    allDeltas.forEach(deltas => {
        for (let i = 0; i < deltas.length - 4; i++) {
            const seq = deltas.slice(i, i + 4);
            const key = seq.join(',');

            if (!allSeqsMap[key]) {
                allSeqsMap[key] = seq;
            }
        }
    });

    const allSeqs = R.values(allSeqsMap);

    const dataSet = data.map(num => {
        const prices = calculatePrices(num);
        const deltas = calculateDeltas(prices);

        return { prices, deltas };
    });

    let best = allSeqs[0];
    let bestScore = 0;

    allSeqs.forEach((seq, i) => {
        const score = calculateScore(dataSet, seq);
        if (score > bestScore) {
            best = seq;
            bestScore = score;
        }

        U.log(i, '/', allSeqs.length, seq, score, bestScore);
    });

    return best;
}


function run(data) {
    const seq = findSequence(data);

    U.log(seq);

    const dataSet = data.map(num => {
        const prices = calculatePrices(num);
        const deltas = calculateDeltas(prices);

        return { prices, deltas };
    });

    return calculateScore(dataSet, seq)

}

// too low 1712
// 1717