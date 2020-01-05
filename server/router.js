const {
  login,
  logout,
  register,
  collectApplication
} = require('./controller/user')
const { createApplication, getList } = require('./controller/application')

const checkLogin = require('./middlewares/checkLogin')

module.exports = router => {
  router.get('/api/login', login)
  router.post('/api/register', register)
  router.post('/api/logout', logout)
  router.post('/api/create-application', checkLogin, createApplication)
  router.get('/api/get-applications', checkLogin, getList)
  router.post('/api/collect-application', checkLogin, collectApplication)
}
