const {
  createVersion,
  createNewVersion,
  removeVersionById,
  getPkgList
} = require('../service/version')
const config = require('../../config')
const logger = require('../../assets/js/log')()
const { getNodeVersions } = require('../../assets/js/utils')
const buildPackage = require('../../assets/js/build-command')
const request = require('../../assets/js/request')

exports.createVersion = async ctx => {
  const params = ctx.request.body
  const result = await createVersion(params)
  if (result != null) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: 'CREATE_VERSION_FAILED',
      message: '创建版本失败'
    }
  }
}

exports.getCreateBuildInfo = async ctx => {
  const projectId = ctx.query.appid
  let branches = null
  branches = await request(ctx, {
    baseURL: 'http://gitlab.dajiba.vip',
    headers: {
      private_token: config.gitlab.accessToken
    }
  }).get(`/api/v4/projects/${projectId}/repository/branches`)
  logger.info(`/api/v4/projects/${projectId}/repository/branches`, branches)
  if (branches) {
    const result = []
    for (let { name } of branches) {
      let commits = await request(ctx, {
        baseURL: 'http://gitlab.dajiba.vip',
        headers: {
          private_token: config.gitlab.accessToken
        }
      }).get(
        `/api/v4/projects/${projectId}/repository/commits?refname=${name}&all=true`
      )
      logger.info(`/api/v4/projects/${projectId}/repository/commits`, commits)
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

exports.getNodeVersions = async ctx => {
  const versions = await getNodeVersions()
  ctx.body = {
    code: 0,
    data: versions
  }
}

exports.createNewVersion = async ctx => {
  const body = ctx.request.body
  logger.info(body)

  const res = await createNewVersion(body)

  // TODO: exec serial build-commands
  if (res) {
    ctx.body = {
      code: 0,
      data: 'OK'
    }
    try {
      await buildPackage(ctx.app)(body)
    } catch (error) {
      logger.error(error)
      removeVersionById(res._id)
    }
  }
}

exports.getPkgList = async ctx => {
  const query = ctx.query
  const list = getPkgList(query)
  if (list) {
    ctx.body = {
      code: 0,
      data: list
    }
  }
}
