const path = require('path')
const anymatch = require('anymatch')

const noop = () => {}
const arrify = (item) => (Array.isArray(item) ? item : [item])
const defaultOptions = {
  includes: '**/*',
  callback: noop
}

class WatchMatchWebpackPlugin {
  constructor(options) {
    let { includes, callback } = {
      ...defaultOptions,
      ...options
    }
    const matchers = arrify(options.includes)
    this.matcher = anymatch(matchers)
    this.callback = callback
  }

  apply(compiler) {
    compiler.hooks.watchRun.tapAsync(
      'WatchMatchWebpackPlugin',
      async (compilation, callback) => {
        const changedFiles = Object.keys(
          compilation.watchFileSystem.watcher.mtimes
        )
        const matchedFiles = changedFiles.filter(this.matcher)

        if (matchedFiles.length > 0) {
          await this.callback(matchedFiles)
        }

        callback()
      }
    )
  }
}

module.exports = WatchMatchWebpackPlugin
