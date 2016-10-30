'use strict';

const globParent = require('glob-parent');
const matched = require('matched').promise;
const getLoaderConfig = require('loader-utils').getLoaderConfig;

const mapImports = d => `import ${JSON.stringify(d)};`;
const mapExports = d => `export * from ${JSON.stringify(d)};`;

function multiEntryLoader(content, map) {
    const done = this.async();
    if (content !== null) {
        return done(null, content, map);
    }

    const options = Object.assign({
        include: [],
        exclude: [],
        exports: false
    }, getLoaderConfig(this));

    const include = Array.isArray(options.include) ? options.include : [options.include];
    const exclude = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
    const patterns = include.concat(exclude.map(pattern => '!' + pattern));
    const mapPaths = options.exports ? mapExports : mapImports;
    const combinePaths = paths => paths.map(mapPaths).join('\n');

    if (!include.length) {
        throw Error('include option should be specified');
    }

    const parents = include.reduce((list, pattern) => {
        const parent = globParent(pattern);
        if (list.indexOf(parent) === -1) {
            list.push(parent);
        }
        return list;
    }, []);

    parents.forEach(parent => this.addContextDependency(parent));

    return matched(patterns, { realpath: true }).then(combinePaths).then(code => done(null, code));
}

module.exports = multiEntryLoader;
