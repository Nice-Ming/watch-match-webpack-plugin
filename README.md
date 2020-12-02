# Watch Match Webpack Plugin

A Webpack plugin to invoke callback when file changed.

## Install

```shell
npm install --save-dev watch-match-webpack-plugin
```

## Usage

```javascript
// webpack.config.js
const WatchMatchWebpackPlugin = require('watch-match-webpack-plugin')

module.exports = {
  plugins: [
    new WatchMatchWebpackPlugin({
      includes: '**/*',
      callback(matchedFiles) {
        console.log(
          'Hey look here, webpack watch these files have changed:\n',
          matchedFiles.join('\n')
        )
      },
    }),
  ],
}
```

## Options

### `options.includes`

Type: `String | String[]`

Default: `**/*`

Match rules use [anymatch](https://github.com/micromatch/anymatch).

### `options.callback`

Type: `Function`

Default: `() => {}`

Support `sync` or `async` function.

## License

MIT
