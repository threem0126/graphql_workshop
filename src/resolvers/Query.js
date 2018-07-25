const { getUserId,AuthError } = require('../utils')
const {keys} = require('lodash')
const { forwardTo } = require("prisma-binding");

const Query = {  
  currentuser(parent, args, ctx, info) { 
    let { _hello } = ctx
    console.log(_hello);
    const {userId} = ctx
    if(!userId)
      throw new AuthError()
    return ctx.db.query.user({where:{id:userId}}, `{id, name}`)
  },
  user:forwardTo("db"),
  users:forwardTo("db"),
  comments:forwardTo("db")
}

module.exports = { Query }
