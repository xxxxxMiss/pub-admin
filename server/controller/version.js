const { createVersion, getCreateBuildInfo } = require('../service/version')
const axios = require('axios')
const config = require('../../config')
const dayjs = require('dayjs')

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
  const branches = await axios.get(
    `http://gitlab.dajiba.vip/api/v4/projects/${projectId}/repository/branches`,
    {
      headers: {
        private_token: config.gitlab.accessToken
      }
    }
  )
  if (branches.status == 200) {
    const result = []
    // const since = dayjs()
    // .set('date', -7)
    // .toISOString()
    for (let { name } of branches.data) {
      // YYYY-MM-DDTHH:MM:SSZ
      let commits = await axios.get(
        `http://gitlab.dajiba.vip/api/v4/projects/${projectId}/repository/commits?refname=${name}&all=true`,
        {
          headers: {
            private_token: config.gitlab.accessToken
          }
        }
      )
      console.log('---name--', name)
      console.log('-----', commits.data)
      // transform data:  for frontend convenient loop
      commits = (commits.data || []).map(item => {
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
    ctx.status = res.status
    ctx.res.end()
  }
}
