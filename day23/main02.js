const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split('-'));
}

function createGraph(data) {
    const names = findUniqueNames(data);

    let connections = {};
    let links = {};

    names.forEach(name => {
        const pairs = data.filter(x => x[0] === name || x[1] === name);

        pairs.forEach(pair => {
            let other = pair[0];
            if (pair[0] === name) {
                other = pair[1];
            }

            connections[name] = connections[name] || [];
            connections[name].push(other);

            links[`${pair[0]}-${pair[1]}`] = true;
            links[`${pair[1]}-${pair[0]}`] = true;
        })
    });

    return {
        names,
        connections,
        links
    };
}

function findUniqueNames(data) {
    return R.uniq(R.flatten(data));
}

function findPermutations(graph, checkFunc) {
    const { names } = graph;

    let result = names.map(n => ([n]));
    let iteration = 1;

    while (result.length > 1) {
        let nextResult = [];
        
        result.forEach(perm => {
            names.forEach(name => {
                if (checkFunc(perm, name)) {
                    nextResult.push([...perm, name]);
                }
            
            });
        });

        result = nextResult;

        result = R.uniq(result.map(r => r.sort().join(','))).map(r => r.split(','));

        U.log(iteration, result.length);

        iteration++;
    }

    return result;

}

// --------------------------------------------

function run(data) {

    const graph = createGraph(data);
    const perms = findPermutations(graph, (perm, name) => {
        const { links } = graph;
        
        for (pname of perm) {
            const x = links[`${name}-${pname}`];
            if (!Boolean(x)) {
                return false;
            }
        }

        return true;
    });

    U.logf(perms.sort());

    const best = perms[0];

    const result = best.join(',');

    return result;
}

