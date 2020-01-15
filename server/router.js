const {
  login,
  logout,
  register,
  getUserInfo,
  collectApplication
} = require('./controller/user')
const { createApplication, getList } = require('./controller/application')
const {
  getCreateBuildInfo,
  getNodeVersions,
  createNewVersion
} = require('./controller/version')

const checkLogin = require('./middlewares/checkLogin')

module.exports = router => {
  router.get('/api/login', login)
  router.post('/api/register', register)
  router.post('/api/logout', logout)
  router.post('/api/create-application', checkLogin, createApplication)
  router.get('/api/get-applications', checkLogin, getList)
  router.post('/api/collect-application', checkLogin, collectApplication)
  router.get('/api/get-userinfo', checkLogin, getUserInfo)
  router.get('/api/get-create-build-info', checkLogin, getCreateBuildInfo)
  router.get('/api/get-node-versions', checkLogin, getNodeVersions)
  router.post('/api/create-new-version', checkLogin, createNewVersion)
}
