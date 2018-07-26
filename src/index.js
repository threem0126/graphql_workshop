import { GraphQLServer } from 'graphql-yoga'
import {Prisma} from 'prisma-binding'
const { RedisCache } = 'apollo-server-cache-redis';
import { getUserId } from './lib/utils'
import costAnalysis from 'graphql-cost-analysis'
import customDirectives from './lib/directives'
import {resolvers}  from './models/_index.js'
//https://github.com/pa-bru/graphql-cost-analysis#costanalysis-configuration

let prisma_options = {
  typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  secret: process.env.PRISMA_SECRET, // only needed if specified in `database/prisma.yml` (value set in `.env`)
}

if(process.env.Prisma_Test==="1"){
  prisma_options = {
    ...prisma_options,
    typeDefs: 'src/generated_test/prisma.graphql', 
    endpoint: 'http://106.75.17.86:6789/',
    secret: 'test_106_75_17_86_lkqo20zqeMuHa7640'
  }
}

const db = new Prisma({
  ...prisma_options,
  debug: true, // log all GraphQL queries & mutations sent to the Prisma API
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
server.start(options, () => {
  console.log(`Prisma-API sendpoint is ${prisma_options.endpoint}, ${ prisma_options.secret?'with secret need!':'without secret' }`)
  console.log('Application Server is running on http://localhost:4000');
})
