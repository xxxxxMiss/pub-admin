module.exports = {
  Query: {
    application: async (_, __, { dataSources }) => {
      return await dataSources.applicationAPI.getList()
    },
    me: async (_, { name }, { dataSources }) => {
      const user = await dataSources.userAPI.getUserInfo({ name })
      return user
    }
  },
  Mutation: {
    login: async (_, { name, password }, { dataSources }) => {
      return await dataSources.userAPI.register({ name, password })
    }
  }
}
