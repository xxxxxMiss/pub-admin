const { getAssumeRole } = require('~js/ali-sts')
const dayjs = require('dayjs')
const _ = require('lodash')
const OSS = require('ali-oss')

module.exports = function getOssClient(options = {}) {
  return async (ctx, next) => {
    const timestamp = Date.now()
    const expires = _.get(ctx, 'oss.Credentials.Expiration', null)

    if (!expires || timestamp > dayjs(expires)) {
      const role = await getAssumeRole()
      ctx.oss = role
      const ak = role.Credentials
      ctx.ossClient = new OSS({
        region: _.get(options, 'region', 'oss-cn-beijing'),
        accessKeyId: ak.AccessKeyId,
        accessKeySecret: ak.AccessKeySecret,
        bucket: _.get(options, 'bucket', 'zs-op'),
        stsToken: ak.SecurityToken
      })
    }
    await next()
  }
}
