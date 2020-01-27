const user = require('./controller/user')
const application = require('./controller/application')
const version = require('./controller/version')
const oss = require('./controller/oss')

const checkLogin = require('./middlewares/checkLogin')
const getOssClient = require('./middlewares/getOssClient')
const multer = require('@koa/multer')
const upload = multer() // note you can pass `multer` options here

module.exports = router => {
  router.get('/api/login', user.login)
  router.post('/api/register', user.register)
  router.post('/api/logout', user.logout)
  router.post(
    '/api/create-application',
    checkLogin,
    application.createApplication
  )
  router.get('/api/get-applications', checkLogin, application.getList)
  router.post('/api/collect-application', checkLogin, user.collectApplication)
  router.get('/api/get-userinfo', checkLogin, user.getUserInfo)
  router.get(
    '/api/get-create-build-info',
    checkLogin,
    version.getCreateBuildInfo
  )
  router.get('/api/get-node-versions', checkLogin, version.getNodeVersions)
  router.post('/api/create-new-version', checkLogin, version.createNewVersion)
  router.get('/api/get-pkg-list', checkLogin, version.getPkgList)
  router.get('/api/get-build-log', checkLogin, version.getBuildLog)
  router.post('/api/abort-build', checkLogin, version.abortBuild)
  router.get('/api/get-oss-list', checkLogin, getOssClient(), oss.list)
  router.post(
    '/api/put-oss',
    checkLogin,
    getOssClient(),
    upload.single('avatar'),
    oss.put
  )
}
