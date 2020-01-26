const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const buildPackage = require('./build-command')

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

// DI
exports.updateBuildInfo = async function updateBuildInfo(ctx, version) {
  let i = 0
  let archiverPath =
    ctx.app.config.build[process.env.NODE_ENV || 'development'].archiver
  const stages = ctx.app.config.build.stages

  try {
    for (; i < stages.length; ++i) {
      version.status[i] = 'building'
      version.markModified('status')
      await version.save()

      const { code, signal } = await buildPackage(ctx)({
        ...ctx.request.body,
        stage: stages[i]
      })
      if (code == 0) {
        version.status[i] = 'success'
        version.downloadUrl[i] = `${archiverPath}/${stages[i]}.gzip`
        version.markModified('downloadUrl')
        version.markModified('status')
        await version.save()
      } else if (signal === 'SIGTERM') {
        version.status[i] = 'aborted'
        await version.save()
        break
      }
    }
  } catch (error) {
    ctx.logger.error(error)
    version.status[i] = 'failed'
    await version.save()
  }
}
