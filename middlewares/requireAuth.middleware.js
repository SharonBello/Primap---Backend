const authService = require('../api/auth/auth.service')
const logger = require('../services/logger.service')


function requireAuth(req, res, next) {
 
  if (!req?.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const loggedUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedUser) return res.status(401).send('Not Authenticated')
  next()
}

function requireAdmin(req, res, next) {
  
  if (!req?.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const loggedUser = authService.validateToken(req.cookies.loginToken)  
  // if(loggedUser.isAdmin === 'false') loggedUser.isAdmin = false
  if (!loggedUser.isAdmin) {
    logger.warn(loggedUser.fullName + 'attempted to perform admin action')
    res.status(403).end('Not Authorized to do this action')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
