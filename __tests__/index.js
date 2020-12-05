const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const WatchMatchWebpackPlugin = require('../index')

const getWebpackConfig = () => {
  return {
    mode: 'development',
    entry: path.resolve(__dirname, './fixtures/src/index.js'),
    output: {
      path: path.resolve(__dirname, './fixtures/dist')
    }
  }
}

describe('WatchMatchWebpackPlugin', () => {
  it('provide string includes', (done) => {
    let watching

    const config = Object.assign({}, getWebpackConfig(), {
      plugins: [
        new WatchMatchWebpackPlugin({
          includes: '**/*.json',
          callback(matchedFiles) {
            watching.close()
            expect(matchedFiles.length).toBe(1)
            done()
          }
        })
      ]
    })

    const compiler = webpack(config)
    watching = compiler.watch({}, (err, stats) => {
      if (err) {
        return done(err)
      }

      setTimeout(() => {
        fs.writeFileSync(
          path.resolve(__dirname, './fixtures/src/name.json'),
          '{"name": "laisiming"}'
        )
      }, 500)
    })
  })

  it('provide array includes', (done) => {
    let watching
    const config = Object.assign({}, getWebpackConfig(), {
      plugins: [
        new WatchMatchWebpackPlugin({
          includes: ['**/*.json', '**/*.js'],
          callback(matchedFiles) {
            watching.close()
            expect(matchedFiles.length).toBe(2)
            done()
          }
        })
      ]
    })

    const compiler = webpack(config)
    watching = compiler.watch({}, (err, stats) => {
      if (err) {
        return done(err)
      }

      setTimeout(() => {
        fs.writeFileSync(
          path.resolve(__dirname, './fixtures/src/name.json'),
          '{"name": "laisiming"}'
        )
        fs.writeFileSync(
          path.resolve(__dirname, './fixtures/src/hello.js'),
          `
            const hello = (name) => {
              console.log('say hello ', name)
            }

            export default hello
          `
        )
      }, 500)
    })
  })

  it('provide sync callback', (done) => {
    let watching
    const config = Object.assign({}, getWebpackConfig(), {
      plugins: [
        new WatchMatchWebpackPlugin({
          includes: '**/*.json',
          callback: function() {
            watching.close()
            done()
          }
        })
      ]
    })

    const compiler = webpack(config)
    watching = compiler.watch({}, (err, stats) => {
      if (err) {
        return done(err)
      }

      setTimeout(() => {
        fs.writeFileSync(
          path.resolve(__dirname, './fixtures/src/name.json'),
          '{"name": "laisiming"}'
        )
      }, 500)
    })
  })

  it('provide async callback', (done) => {
    let watching

    const config = Object.assign({}, getWebpackConfig(), {
      plugins: [
        new WatchMatchWebpackPlugin({
          includes: '**/*.json',
          callback: async function(matchedFiles) {
            await Promise.resolve()
            watching.close()
            done()
          }
        })
      ]
    })

    const compiler = webpack(config)
    watching = compiler.watch({}, (err, stats) => {
      if (err) {
        return done(err)
      }

      setTimeout(() => {
        fs.writeFileSync(
          path.resolve(__dirname, './fixtures/src/name.json'),
          '{"name": "laisiming"}'
        )
      }, 500)
    })
  })
})
