const { getUserId,AuthError } = require('../utils')
const {keys} = require('lodash')
const { forwardTo } = require("prisma-binding");

const Query = {  
  currentuser(parent, args, ctx, info) {
    // console.log(keys(parent));
    // console.log(keys(args));
    // console.log(keys(ctx));
    // console.log(keys(info));
    let { _hello } = ctx
    console.log(_hello);
    const {userId} = ctx
    if(!userId)
      throw new AuthError()
    return ctx.db.query.user({where:{id:userId}}, `{id, name}`)
  },
  user:forwardTo("db")
}

module.exports = { Query }
