const { createVersion, getCreateBuildInfo } = require('../service/version')
const axios = require('axios')
const config = require('../../config')

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
  const projectId = ctx.query.appId
  const res = await axios.get(
    `http://gitlab.dajiba.vip/api/v4/projects/${projectId}/repository/branches`,
    {
      headers: {
        private_token: config.gitlab.accessToken
      }
    }
  )
  if (res.status == 200) {
    ctx.body = {
      code: 0,
      data: res.data
    }
  } else {
    ctx.status = res.status
    ctx.res.end()
  }
}
