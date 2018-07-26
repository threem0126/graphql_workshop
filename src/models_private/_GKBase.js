import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken' 
import {isMutation, isQuery} from '../lib/resolvers.loader'

class _GKBase {
  constructor() {
      throw '静态业务功能类无法实例化'
  }

  @isMutation
  static async TODO(parent, {params}, ctx, info) { 
  }
}

export default _GKBase