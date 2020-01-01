const {
  login,
  logout,
  register,
  collectApplication
} = require('./controller/user')
const { createApplication, getList } = require('./controller/application')

module.exports = router => {
  router.get('/api/login', login)
  router.post('/api/create-application', createApplication)
  router.get('/api/get-applications', getList)
  router.post('/api/register', register)
  router.post('/api/collect-application', collectApplication)
  router.post('/api/logout', logout)
}
