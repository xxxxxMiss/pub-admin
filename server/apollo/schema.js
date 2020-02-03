const gql = require('graphql-tag')

const typeDefs = gql`
  type Query {
    me: User
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
`
module.exports = typeDefs
