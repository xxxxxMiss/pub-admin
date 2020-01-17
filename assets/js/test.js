const { exec, execFile } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log(fs.existsSync(path.join(__dirname, '../hooks')))
