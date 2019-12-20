const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const loadYamlFile = file => yaml.safeLoad(fs.readFileSync(file, 'utf8'))

module.exports = loadYamlFile(path.resolve(__dirname, './app.yaml'))
