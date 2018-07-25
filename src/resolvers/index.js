const { Query } = require('./Query')
const { auth } = require('./Mutation/auth')
const { blog } = require('./Mutation/blog')
// const { AuthPayload } = require('./AuthPayload')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...blog
  },
  // AuthPayload,
}
