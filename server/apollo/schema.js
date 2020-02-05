const gql = require('graphql-tag')

const typeDefs = gql`
  type Query {
    application(page: Int!, pageSize: Int!): ApplicationList
    me(name: String!): User
  }
  type Mutation {
    register(name: String!, password: String!): User
    login(name: String!, password: String!): User
  }
  type Application {
    appName: String!
    appDesc: String
    appGitAddr: String!
    appLanguage: String
    appid: Int!
    createTime: String!
  }
  type User {
    name: String!
    password: String!
    createTime: String!
    phone: String
  }
  type Version {
    createAt: String!
    updateAt: String!
    version: String!
    gitUrl: String!
    name: String!
    remark: String
    nodeVersion: String!
    buildTool: String!
    branch: String!
    commit: ID!
    appid: Int!
    status: [String!]!
    publisher: User!
  }
  interface PageInfo {
    total: Int!
    page: Int!
    pageSize: Int!
    hasNextPage: Boolean!
  }
  type VersionList implements PageInfo {
    list: [Version]!
    total: Int!
    page: Int!
    pageSize: Int!
    hasNextPage: Boolean!
  }
  type ApplicationList implements PageInfo {
    list: [Application]!
    total: Int!
    page: Int!
    pageSize: Int!
    hasNextPage: Boolean!
  }
`
module.exports = typeDefs
