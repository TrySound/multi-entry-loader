'use strict';

const matched = require('matched').promise;
const getLoaderConfig = require('loader-utils').getLoaderConfig;

const mapImports = d => `import ${JSON.stringify(d)};`;
const mapExports = d => `export * from ${JSON.stringify(d)};`;

function multiEntryLoader(content) {
    if (content !== null) {
        return content;
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

    return matched(patterns, { realpath: true }).then(combinePaths);
}

module.exports = multiEntryLoader;
