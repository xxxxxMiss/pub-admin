// const shelljs = require('shelljs')
//
// shelljs.exec('nvm ls')
//
// shelljs.echo('hello world')
//
// console.log(shelljs.which('yarn'))

const { spawn } = require('child_process')

const ls = spawn('which', ['nvm'])
ls.stdout.on('data', data => {
  console.log('data----: ', data)
})
