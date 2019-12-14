'use strict'
var importCwd = require('import-cwd');
var extend = require('util')._extend

module.exports = (ext) => function (data) {
  const sass = importCwd.silent('node-sass') || importCwd.silent('sass')
    // support global and theme-specific config
  var userConfig = extend(
        this.theme.config.node_sass || {},
        this.config.node_sass || {}
    )

  var config = extend({
    data: data.text,
    file: data.path,
    outputStyle: sass.info.indexOf('dart-sass') !== -1 ? 'expanded' : 'nested', // dart-sass not support nested
    sourceComments: false,
    indentedSyntax: (ext === 'sass')
  }, userConfig)

  try {
        // node-sass result object:
        // https://github.com/sass/node-sass#result-object
    var result = sass.renderSync(config)
        // result is now Buffer instead of String
        // https://github.com/sass/node-sass/issues/711
    return result.css.toString()
  } catch (error) {
    console.error(error.toString())
    throw error
  }
}
