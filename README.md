# multi-entry-loader [![Build Status][travis-img]][travis]

[travis-img]: https://travis-ci.org/TrySound/multi-entry-loader.svg
[travis]: https://travis-ci.org/TrySound/multi-entry-loader

Load multiple entry points into single [webpack](https://webpack.github.io/) bundle.
This is particularly useful for tests, but can also be used to package
a library. The exports from all the entry points will be combined, e.g.

```js
// a.js
export const a = 1;

// b.js
export const b = 2;

// c.js
export const c = 3;
```

Using all three files above as entry points will yield a bundle with exports for
`a`, `b`, and `c`.

## Install

```
$ yarn add multi-entry-loader --dev
```

## Usage

This loader requires at least v2 of webpack. In `webpack.config.js`:

```js
module.exports {
  entry: 'multi-entry-loader?include=src/**/*.js!',
  output: {
    filename: 'dist/bundle.js'
  }
};
```

```js
module.exports = {
    entry: 'multi-entry-loader!',
    output: {
        filename: 'dist/bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'multi-entry-loader',
                query: {
                    include: 'src/*.mdl.js'
                }
            }
        ]
    }
};
```


The `include` above is the simplest form which simply takes a glob string. If you
wish, you may pass a query with `include` and `exclude` properties each taking a string or
an array of glob strings, e.g.

```js
// As does a glob of files.
module.exports {
  entry: 'multi-entry-loader?include=a/glob/of/files/**/*.js!',
  output: {
    filename: 'dist/bundle.js'
  }
};

// Or an array of files and globs.
module.exports {
  entry: 'multi-entry-loader?include[]=an/array.js,include[]=of/globs.js!',
  output: {
    filename: 'dist/bundle.js'
  }
};

// For maximum control, arrays of globs to include and exclude.
module.exports {
  entry: 'multi-entry-loader?include[]=src/*.mdl.js,include[]=src/*.js,exclude[]=**/*.spec.js,exclude[]=**/*.ww.js!',
  output: {
    filename: 'dist/bundle.js'
  }
};
```

Sometimes you may want to export anything from the bundle. In
such cases, use the `exports: true` option like so:

```js
module.exports {
  entry: 'multi-entry-loader?include=src/*.js,exports!',
  output: {
    filename: 'dist/bundle.js'
  }
};
```

## License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
