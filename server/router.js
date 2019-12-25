const { login } = require('./controller/user')
const { createApplication, getList } = require('./controller/application')
module.exports = router => {
  router.get('/api/login', login)
  router.post('/api/create-application', createApplication)
  router.get('/api/get-applications', getList)
}
