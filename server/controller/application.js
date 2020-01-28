const applicationService = require('../service/application')

exports.createApplication = async ctx => {
  const params = ctx.request.body
  await applicationService.create(params)
  ctx.body = {
    code: 0
  }
}

exports.getList = async ctx => {
  const params = ctx.query
  const data = await applicationService.getList(ctx, params)
  ctx.body = {
    code: 0,
    data: { ...data }
  }
}

exports.search = async ctx => {
  const result = await applicationService.search(ctx.query.qs)
  ctx.body = {
    code: 0,
    data: result || []
  }
}
