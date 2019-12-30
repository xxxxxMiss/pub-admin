const { createVersion } = require('../service/version')

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
