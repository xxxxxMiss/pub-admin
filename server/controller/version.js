const versionService = require('../service/version')
const { getNodeVersions } = require('~js/utils')
const buildPackage = require('~js/build-command')
const request = require('~js/request')
const fsPromise = require('fs').promises
const path = require('path')
const _ = require('lodash')
const buildEvent = require('~js/socketio-event')
const { versionJoiSchema } = require('~js/validation')

exports.getCreateBuildInfo = async ctx => {
  const projectId = ctx.query.appid
  let branches = null
  branches = await request(ctx, {
    baseURL: 'http://gitlab.dajiba.vip',
    headers: {
      private_token: ctx.app.config.gitlab.accessToken
    }
  }).get(`/api/v4/projects/${projectId}/repository/branches`)

  if (branches) {
    const result = []
    for (let { name } of branches) {
      let commits = await request(ctx, {
        baseURL: 'http://gitlab.dajiba.vip',
        headers: {
          private_token: ctx.app.config.gitlab.accessToken
        }
      }).get(
        `/api/v4/projects/${projectId}/repository/commits?refname=${name}&all=true`
      )
      // transform data:  for frontend convenient loop
      commits = (commits || []).map(item => {
        item.label = item.short_id
        item.value = item.short_id
        return item
      })
      result.push({
        label: name,
        value: name,
        children: commits
      })
    }
    ctx.body = {
      code: 0,
      data: result
    }
  } else {
    ctx.status = 500
  }
}

exports.getBranches = async ctx => {
  const projectId = ctx.query.appid
  const branches = await request(ctx, {
    baseURL: 'http://gitlab.dajiba.vip',
    headers: {
      private_token: ctx.app.config.gitlab.accessToken
    }
  }).get(`/api/v4/projects/${projectId}/repository/branches`)

  if (branches) {
    ctx.body = {
      code: 0,
      data: branches
    }
  }
}

exports.getCommits = async ctx => {
  const { appid: projectId, name } = ctx.query.appid
  const commits = await request(ctx, {
    baseURL: 'http://gitlab.dajiba.vip',
    headers: {
      private_token: ctx.app.config.gitlab.accessToken
    }
  }).get(
    `/api/v4/projects/${projectId}/repository/commits?refname=${name}&all=true`
  )

  if (commits) {
    ctx.body = {
      code: 0,
      data: commits
    }
  }
}

exports.getNodeVersions = async ctx => {
  const versions = await getNodeVersions()
  ctx.body = {
    code: 0,
    data: versions
  }
}

exports.createNewVersion = async ctx => {
  const body = ctx.request.body
  ctx.logger.info(body)

  const { error } = await versionJoiSchema.validateAsync(body)
  if (error) {
    ctx.status = 400
    ctx.message = error.message
    return
  }
  const version = await versionService.createNewVersion(body)

  if (version) {
    ctx.body = {
      code: 0,
      data: version
    }
    let i = 0
    let archiverPath =
      ctx.app.config.buildPath[process.env.NODE_ENV || 'development'].archiver
    const stages = ['fat', 'uat', 'pro']
    try {
      for (; i < stages.length; ++i) {
        const { code, signal } = await buildPackage(ctx)({
          ...body,
          stage: stages[i]
        })
        if (code == 0) {
          version.status[i] = 'success'
          version.downloadUrl[i] = `${archiverPath}/${stages[i]}.gzip`
          // TODO: save successfully, but not persist data to db
          // await version.save()
          await versionService.updateFieldsById(version._id, {
            status: version.status,
            downloadUrl: path.relative(process.cwd(), version.downloadUrl[i])
          })
        } else if (signal === 'SIGTERM') {
          version.status[i] = 'aborted'
          version.downloadUrl[i] = `${archiverPath}/${stages[i]}.gzip`
          await versionService.updateFieldsById(version._id, {
            status: version.status,
            downloadUrl: path.relative(process.cwd(), version.downloadUrl[i])
          })
          break
        }
      }
    } catch (error) {
      ctx.logger.error(error)
      version.status[i] = 'failed'
      version.downloadUrl[i] = `${archiverPath}/${stages[i]}.gzip`
      await versionService.updateFieldsById(version._id, {
        status: version.status,
        downloadUrl: path.relative(process.cwd(), version.downloadUrl[i])
      })
      // await version.save()
    }
  }
}

exports.getPkgList = async ctx => {
  const query = ctx.query
  const list = await versionService.getPkgList(query)
  if (list) {
    ctx.body = {
      code: 0,
      data: list
    }
  }
}

exports.getBuildLog = async ctx => {
  const logPath = _.get(
    ctx.app.config,
    `buildPath.${process.env.NODE_ENV || 'development'}.log`
  )
  const version = ctx.query.version
  const text = await fsPromise.readFile(path.join(logPath, `${version}.log`), {
    encoding: 'utf8'
  })
  ctx.body = text
}

exports.abortBuild = async ctx => {
  buildEvent.on('build:end', signal => {
    if (signal === 'SIGTERM') {
      ctx.body = {
        code: 0,
        body: { signal }
      }
    } else {
      ctx.status = 500
    }
  })
  buildEvent.emit('build:abort')
}
