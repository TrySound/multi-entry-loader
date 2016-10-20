const assert = require('assert');
const multiEntryLoader = require('../');

function makeBundle(query) {
    const deps = [];
    const context = {
        query,
        addContextDependency(parent) {
            deps.push(parent);
        }
    };
    return Promise.resolve().then(() => multiEntryLoader.call(context, null)).then(code => ({
        code,
        deps
    }));
}

describe('multi-entry-loader', () => {
    it('takes a single file as input', () =>
        makeBundle({
            include: 'test/fixtures/0.js'
        }).then(result => {
            assert(/import ".+0\.js";/.test(result.code));
            assert(!/import ".+1\.js";/.test(result.code));
            assert(!/import ".+2\.js";/.test(result.code));
        })
    );

    it('takes an array of files as input', () =>
        makeBundle({
            include: ['test/fixtures/0.js', 'test/fixtures/1.js']
        }).then(result => {
            assert(/import ".+0\.js";/.test(result.code));
            assert(/import ".+1\.js";/.test(result.code));
            assert(!/import ".+2\.js";/.test(result.code));
        })
    );

    it('takes a glob as input', () =>
        makeBundle({
            include: 'test/fixtures/{0,1}.js'
        }).then(result => {
            assert(/import ".+0\.js";/.test(result.code));
            assert(/import ".+1\.js";/.test(result.code));
            assert(!/import ".+2\.js";/.test(result.code));
        })
    );

    it('takes an array of globs as input', () =>
        makeBundle({
            include: ['test/fixtures/{0,}.js', 'test/fixtures/{1,}.js']
        }).then(result => {
            assert(/import ".+0\.js";/.test(result.code));
            assert(/import ".+1\.js";/.test(result.code));
            assert(!/import ".+2\.js";/.test(result.code));
        })
    );

    it('takes an {include,exclude} object as input', () =>
        makeBundle({
            include: ['test/fixtures/*.js'],
            exclude: ['test/fixtures/1.js']
        }).then(result => {
            assert(/import ".+0\.js";/.test(result.code));
            assert(!/import ".+1\.js";/.test(result.code));
            assert(/import ".+2\.js";/.test(result.code));
        })
    );

    it('does not allow an empty array as input', () =>
        makeBundle({
            include: []
        }).catch(err => {
            assert.equal(err.message, 'include option should be specified');
        })
    );

    it('allows to export all', () =>
        makeBundle({
            include: ['test/fixtures/*.js'],
            exports: true
        }).then(result => {
            assert(/export \* from ".+0\.js";/.test(result.code));
            assert(/export \* from ".+1\.js";/.test(result.code));
            assert(/export \* from ".+2\.js";/.test(result.code));
        })
    );

    it('adds context dependency for one file', () =>
        makeBundle({
            include: ['test/fixtures/1.js']
        }).then(result => {
            assert.deepEqual(result.deps, ['test/fixtures']);
        })
    );

    it('adds context dependency for one glob', () =>
        makeBundle({
            include: ['test/fixtures/*.js']
        }).then(result => {
            assert.deepEqual(result.deps, ['test/fixtures']);
        })
    );

    it('dedupes context dependencies for globs', () =>
        makeBundle({
            include: ['test/fixtures/*.mdl.js', 'test/fixtures/*.js']
        }).then(result => {
            assert.deepEqual(result.deps, ['test/fixtures']);
        })
    );

    it('dedupes context dependencies for different globs', () =>
        makeBundle({
            include: ['test/fixtures/*.js', 'test/tests/*.js']
        }).then(result => {
            assert.deepEqual(result.deps, ['test/fixtures', 'test/tests']);
        })
    );
});
