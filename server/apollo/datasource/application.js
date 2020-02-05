const { DataSource } = require('apollo-datasource')

class ApplicationAPI extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context
  }

  async getList({ page, pageSize }) {
    const skip = (page - 1) * pageSize
    const options = {
      skip,
      limit: pageSize
    }
    const result = await this.store.find({}, null, options).exec()
    const count = await this.store.countDocuments()
    const pages = Math.ceil(count / pageSize)
    const hasNextPage = page < pages
    return {
      list: result,
      page,
      pageSize,
      total: count,
      hasNextPage
    }
  }
}

module.exports = ApplicationAPI
