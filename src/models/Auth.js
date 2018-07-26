import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken' 
import {isMutation, isQuery} from '../lib/resolvers.loader'
import _GKBase from './../models_private/_GKBase'

class Auth { 
  /**
   * 业务静态类，不提供对象实例化
   */
  constructor() {
      throw '静态业务功能类无法实例化'
  }

  @isMutation
  static async signup(parent, {name, email, password}, ctx, info) {
    const hashed_password = await bcrypt.hash(password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { name, email, password:hashed_password },
    })

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  }

  @isMutation
  static async login(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user found for email: ${email}`)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  }
}

export default Auth