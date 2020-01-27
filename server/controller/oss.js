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

// exports.put = async ctx => {
//   const { name, file }
//   await ctx.ossClient.put()
// }
