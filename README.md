# gulp-directory-map
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url] [![Dependency Status][depstat-dev-image]][depstat-dev-url] 

> Convert a buffer of files into a JSON representation of the directory structure using [gulp](https://github.com/gulpjs/gulp)

## Usage

First, install `gulp-directory-map` as a development dependency:

```shell
npm install --save-dev gulp-directory-map
```

Then, add it to your `gulpfile.js`:

```javascript
var directoryMap = require("gulp-directory-map");
  
gulp.src('app/**/*.html')
  .pipe(directoryMap({
    filename: 'urls.json'
  }))
  .pipe(gulp.dest('dist'));

```

Given this directory structure...
```
app
  |_nested-folder-1
    |_nested-folder-1-1
      |_index.html
    |_faq.html
    |_index.html
  |_nested-folder-2
    |_nested-folder-2-1
      |_index.txt
    |_index.html
  |_index.html
  |_index.txt
```

... this JSON object would be written to `dist/urls.json`:

```json
{
  "index.html": "index.html",
  "nested-folder-1": {
    "faq.html": "nested-folder-1/faq.html",
    "index.html": "nested-folder-1/index.html",
    "nested-folder-1-1": {
      "index.html": "nested-folder-1/nested-folder-1-1/index.html"
    }
  },
  "nested-folder-2": {
    "index.html": "nested-folder-2/index.html"
  }
}
```

This is useful for mapping out a directory structure after passing files through a pre-processor, generating data to create navigation during build, and more. Have fun!

## API

### directory-map(options)

#### options.filename
Type: `String`  
Default: `urls.json`

The path to write the directory structure JSON file to.

#### options.prefix
Type: `String`
Default: none

The a string to prepend to every url.

Given the directory structure above, specifiying `prefix: 'prefixed-folder'` would generate this JSON:

```json
{
  "prefixed-folder": {
    "index.html": "prefixed-folder/index.html",
    "nested-folder-1": {
      "faq.html": "prefixed-folder/nested-folder-1/faq.html",
      "index.html": "prefixed-folder/nested-folder-1/index.html",
      "nested-folder-1-1": {
        "index.html": "prefixed-folder/nested-folder-1/nested-folder-1-1/index.html"
      }
    },
    "nested-folder-2": {
      "index.html": "prefixed-folder/nested-folder-2/index.html"
    }
  }
}
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


## Thanks

Thanks to [@hparra](https://github.com/hparra) for creating the [generator-gulp-plugin](https://github.com/hparra/generator-gulp-plugin). It has lots of great examples and boilerplate setup, and was used to get this plugin bootstrapped.

[npm-url]: https://npmjs.org/package/gulp-directory-map
[npm-image]: https://badge.fury.io/js/gulp-directory-map.png

[travis-url]: http://travis-ci.org/masondesu/gulp-directory-map
[travis-image]: https://secure.travis-ci.org/masondesu/gulp-directory-map.png?branch=master

[coveralls-url]: https://coveralls.io/r/masondesu/gulp-directory-map
[coveralls-image]: https://coveralls.io/repos/masondesu/gulp-directory-map/badge.png

[depstat-url]: https://david-dm.org/masondesu/gulp-directory-map
[depstat-image]: https://david-dm.org/masondesu/gulp-directory-map.png
[depstat-dev-url]: https://david-dm.org/masondesu/gulp-directory-map#info=devDependencies
[depstat-dev-image]: https://david-dm.org/masondesu/gulp-directory-map/dev-status.png
