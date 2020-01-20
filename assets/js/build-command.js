const fs = require('fs')
const { spawn } = require('child_process')
const path = require('path')
const config = require('../../config')
const logger = require('../js/log')()
const error = error => {
  if (error) {
    logger.error(error)
  }
}
const buildEvent = require('./socketio-event')

module.exports = function build() {
  return function(options) {
    return new Promise((resolve, reject) => {
      const { gitUrl, branch, buildTool, nodeVersion, name, stage } = options
      const repoName = gitUrl
        .substring(gitUrl.lastIndexOf('/') + 1)
        .replace('.git', '')

      const env = process.env.NODE_ENV || 'development'
      let cwd = config.buildPath[env].repo.replace('$repo_name', repoName)
      const buildLogPath = config.buildPath[env].log.replace(
        '$repo_name',
        repoName
      )
      const logPath = path.join(buildLogPath, `${name}.log`)
      const archiverPath = config.buildPath[env].archiver.replace(
        '$repo_name',
        repoName
      )

      if (!fs.existsSync(buildLogPath)) {
        fs.mkdirSync(buildLogPath, { recursive: true })
      }

      let commands = []
      if (!fs.existsSync(cwd)) {
        commands.push(`git clone ${gitUrl} && cd ${repoName}`)
      } else {
        cwd = path.join(cwd, repoName)
      }
      try {
        commands.push(`git checkout ${branch}`)
      } catch (error) {
        commands.push(`git checkout -b ${branch}`)
      }
      commands.push(`git pull`)
      commands.push(`source $NVM_DIR/nvm.sh && nvm use ${nodeVersion}`)
      // commands.push(`nrm use taobao`)
      if (buildTool === 'npm') {
        commands.push(`npm install`)
        // TODO: support multi stage command: test uat pro
        commands.push(`npm run ${stage}`)
      } else if (buildTool === 'yarn') {
        commands.push(`yarn build`)
      }

      const subprocess = spawn(commands.join(' && '), { cwd, shell: true })
      subprocess.stdout.on('data', data => {
        // socket.io
        buildEvent.emit('build:info', data)
        fs.appendFile(logPath, data, error)
      })
      subprocess.stderr.on('data', data => {
        buildEvent.emit('build:info', data)
        fs.appendFile(logPath, data, error)
      })
      subprocess.on('close', (code, signal) => {
        buildEvent.emit('build:end')
        resolve(code, signal)
        // close socket.io
        if (signal) {
          fs.appendFile(
            logPath,
            `>>>>>>>build end with signal: ${signal}>>>>>>`,
            error
          )
        } else {
          fs.appendFile(
            logPath,
            `>>>>>>>build end with code: ${code}>>>>>>`,
            error
          )
        }
      })
      subprocess.on('error', error => {
        buildEvent.emit('build:error')
        reject(error)
        fs.appendFile(
          logPath,
          `>>>>>>>build error>>>>>>>\r\n${error.toString()}`,
          error
        )
      })
    })
  }
}
