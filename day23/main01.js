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

function findPermutations(length, graph, checkFunc) {
    const { names } = graph;

    if (length === 1) {
        return names.map(n => ([n]));
    }

    const perms = findPermutations(length - 1, graph, checkFunc);

    let result = [];

    perms.forEach(perm => {
        names.forEach(name => {
            if (checkFunc(perm, name)) {
                result.push([...perm, name]);
            }
           
        });
    });

    return result;

}

// --------------------------------------------

function run(data) {

    const graph = createGraph(data);
    const perms = findPermutations(3, graph, (perm, name) => {
        const { links } = graph;
        
        for (pname of perm) {
            const x = links[`${name}-${pname}`];
            if (!Boolean(x)) {
                return false;
            }
        }

        return true;
    });

    const permsUniq = R.uniq(perms.map(r => r.sort().join(','))).map(r => r.split(','));

    U.logf(permsUniq.sort());

    const result = permsUniq.filter(perm => perm.find(name => name[0] === 't'));

    return result.length;
}

