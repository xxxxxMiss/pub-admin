const fs = require('fs')
const child_process = require('child_process')
const util = require('util')
const exec = util.promisify(child_process.exec)
const os = require('os')
const path = require('path')

module.exports = async function build(options) {
  const { gitUrl, branch, buildTool, nodeVersion } = options
  const repoDir = gitUrl
    .substring(gitUrl.lastIndexOf('/') + 1)
    .replace('.git', '')
  // const targetPath = '/opt/frontend'
  const targetPath = path.join(os.homedir(), 'test__xx')
  const buildLogPath = path.join(targetPath, 'build_log')
  fs.mkdirSync(buildLogPath)
  const logPath = path.join(buildLogPath, '1.txt')

  if (!fs.existsSync(repoDir)) {
    const cloneLog = await exec(`git clone ${gitUrl}`, { cwd: targetPath })
    fs.appendFileSync(logPath, cloneLog.stdout)
  }
  const cwd = path.join(targetPath, repoDir)
  try {
    const checkoutLog = await exec(`git checkout ${branch}`, {
      cwd
    })
    fs.appendFileSync(logPath, checkoutLog.stdout)
  } catch (error) {
    const checkoutLog = await exec(`git checkout -b ${branch}`, { cwd })
    fs.appendFileSync(logPath, checkoutLog.stdout)
  }
  const pullLog = await exec(`git pull`, { cwd })
  fs.appendFileSync(logPath, pullLog.stdout)
  const nvmLog = await exec(
    `source $NVM_DIR/nvm.sh && nvm use ${nodeVersion}`,
    { cwd }
  )
  fs.appendFileSync(logPath, nvmLog.stdout)
  await exec(`nrm use taobao`)
  if (buildTool === 'npm') {
    const installLog = await exec(`npm install`, { cwd })
    fs.appendFileSync(logPath, installLog.stdout)
    const buildLog = await exec(`npm run build`, { cwd })
    fs.appendFileSync(logPath, buildLog.stdout)
  } else if (buildTool === 'yarn') {
    const buildLog = await exec(`yarn build`, { cwd })
    fs.appendFileSync(logPath, buildLog.stdout)
  }
}
