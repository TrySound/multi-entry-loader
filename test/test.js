const assert = require('assert');
const multiEntryLoader = require('../');

function makeBundle(query) {
    const context = {
        query
    };
    return Promise.resolve().then(() => multiEntryLoader.call(context, null));
}

describe('multi-entry-loader', () => {
    it('takes a single file as input', () =>
        makeBundle({
            include: 'test/fixtures/0.js'
        }).then(code => {
            assert(/import ".+0\.js";/.test(code));
            assert(!/import ".+1\.js";/.test(code));
            assert(!/import ".+2\.js";/.test(code));
        })
    );

    it('takes an array of files as input', () =>
        makeBundle({
            include: ['test/fixtures/0.js', 'test/fixtures/1.js']
        }).then(code => {
            assert(/import ".+0\.js";/.test(code));
            assert(/import ".+1\.js";/.test(code));
            assert(!/import ".+2\.js";/.test(code));
        })
    );

    it('takes a glob as input', () =>
        makeBundle({
            include: 'test/fixtures/{0,1}.js'
        }).then(code => {
            assert(/import ".+0\.js";/.test(code));
            assert(/import ".+1\.js";/.test(code));
            assert(!/import ".+2\.js";/.test(code));
        })
    );

    it('takes an array of globs as input', () =>
        makeBundle({
            include: ['test/fixtures/{0,}.js', 'test/fixtures/{1,}.js']
        }).then(code => {
            assert(/import ".+0\.js";/.test(code));
            assert(/import ".+1\.js";/.test(code));
            assert(!/import ".+2\.js";/.test(code));
        })
    );

    it('takes an {include,exclude} object as input', () =>
        makeBundle({
            include: ['test/fixtures/*.js'],
            exclude: ['test/fixtures/1.js']
        }).then(code => {
            assert(/import ".+0\.js";/.test(code));
            assert(!/import ".+1\.js";/.test(code));
            assert(/import ".+2\.js";/.test(code));
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
        }).then(code => {
            assert(/export \* from ".+0\.js";/.test(code));
            assert(/export \* from ".+1\.js";/.test(code));
            assert(/export \* from ".+2\.js";/.test(code));
        })
    );
});
