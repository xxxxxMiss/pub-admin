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
      await updateFields(version, i, 'building')

      const { code, signal } = await buildPackage(ctx)({
        ...ctx.request.body,
        stage: stages[i]
      })
      if (code == 0) {
        version.downloadUrl[i] = `${archiverPath}/${stages[i]}.gzip`
        version.markModified('downloadUrl')
        await updateFields(version, i, 'success')
      } else if (signal === 'SIGTERM') {
        await updateFields(version, i, 'aborted')
        break
      }
    }
  } catch (error) {
    ctx.logger.error(error)
    await updateFields(version, i, 'failed')
  }
}

async function updateFields(doc, i, status) {
  doc.status[i] = status
  doc.markModified('status')
  if (status === 'building') {
    doc.buildAt[i] = {
      start: Date.now()
    }
  } else {
    doc.$set(`buildAt.${i}.end`, Date.now())
  }
  doc.markModified('buildAt')
  await doc.save()
}
