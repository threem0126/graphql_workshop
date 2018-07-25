const jwt = require('jsonwebtoken') 

function getUserId(request) {
  const temp_suserID = request.header('userID')||0 
  const Authorization = request.header('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    return userId
  }else{
    return 0
  }
  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}

module.exports = {
  getUserId,
  AuthError
}