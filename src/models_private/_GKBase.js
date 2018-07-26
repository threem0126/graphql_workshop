import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'  

class _GKBase {
  constructor() {
      throw '静态业务功能类无法实例化'
  }

  static async TODO(parent, {params}, ctx, info) { 
  }
}

export default _GKBase