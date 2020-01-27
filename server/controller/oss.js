exports.list = async ctx => {
  const ls = await ctx.ossClient.list()
  if (ls) {
    ctx.body = {
      code: 0,
      data: ls
    }
  } else {
    ctx.status = 500
    ctx.message = 'Request oss list failed'
  }
}

exports.put = async ctx => {
  const { originalname, buffer } = ctx.request.file
  const result = await ctx.ossClient.put(originalname, buffer)
  if (result) {
    ctx.body = {
      code: 0,
      data: result
    }
  } else {
    ctx.status = 500
    ctx.message = 'Put file to ali oss failed'
  }
}
