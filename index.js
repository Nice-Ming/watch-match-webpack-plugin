const path = require('path')
const anymatch = require('anymatch')

const noop = () => {}
const arrify = (item) => (Array.isArray(item) ? item : [item])
const defaultOptions = {
  includes: '**/*',
  callback: noop,
}

class MatchWatchWebpackPlugin {
  constructor(options) {
    let { includes, callback } = {
      ...defaultOptions,
      ...options,
    }

    includes = arrify(options.includes)
    const matchers = includes.map((include) => path.resolve(root, include))

    this.matcher = anymatch(matchers)
    this.callback = callback
  }

  apply(compiler) {
    compiler.hooks.watchRun.tapAsync(
      'MatchWatchWebpackPlugin',
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

module.exports = MatchWatchWebpackPlugin
