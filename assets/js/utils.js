// const shelljs = require('shelljs')
//
// shelljs.exec('nvm ls')
//
// shelljs.echo('hello world')
//
// console.log(shelljs.which('yarn'))

const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

exports.getNodeVersions = function getNodeVersions() {
  return new Promise((resolve, reject) => {
    exec('echo $NVM_DIR', (error, stdout) => {
      if (error) {
        return reject(error)
      }

      stdout = stdout.split(/\r?\n/).join('')
      const versions = fs.readdirSync(path.join(stdout, 'versions/node'))
      resolve(versions)
    })
  })
}
