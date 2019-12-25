const { create, getList } = require('../service/application')

exports.createApplication = async ctx => {
  const params = ctx.request.body
  await create(params)
  ctx.body = {
    code: 0
  }
}

exports.getList = async ctx => {
  const params = ctx.query
  const list = await getList(params)
  ctx.body = {
    code: 0,
    data: list
  }
}
