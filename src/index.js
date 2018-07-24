const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')
const { RedisCache } = require('apollo-server-cache-redis');
const { getUserId } = require('./utils')
const { default: costAnalysis } = require('graphql-cost-analysis')
const customDirectives = require('./directives');
//https://github.com/pa-bru/graphql-cost-analysis#costanalysis-configuration

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  debug: true, // log all GraphQL queries & mutations sent to the Prisma API
  // secret: process.env.PRISMA_SECRET, // only needed if specified in `database/prisma.yml` (value set in `.env`)
}) 

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  // cache: new RedisCache({
  //   host: '127.0.0.1',
  //   port:6379
  // }),
  schemaDirectives: customDirectives,
  context: req => ({ 
    ...req, 
    userId:getUserId(req.request),
    db }),
}) 

const options = {
  cors:true,
  resolverValidationOptions:{
    requireResolversForResolveType:false
  },
  validationRules: (req) => [
    costAnalysis({
      variables: req.query.variables,
      maximumCost: 500,
      defaultCost: 1,
      onComplete(cost) {
        console.log(`Cost analysis score: ${cost}`)
      },
      createError(maximumCost, cost){
        console.log(`Cost createError, maximumCost:${maximumCost} cost:${cost}`)
      }
    })
  ]
}
server.start(options, () => console.log('Server is running on http://localhost:4000'))
