const authService = require('../api/auth/auth.service')
const asyncLocalStorage = require('../services/als.service')

async function setupAsyncLocalStorage(req, res, next) {
  const storage = {}
  asyncLocalStorage.run(storage, () => {
    if (!req.cookies) return next()
    const loggedUser = authService.validateToken(req.cookies.loginToken)

    if (loggedUser) {
      const alsStore = asyncLocalStorage.getStore()
      alsStore.loggedUser = loggedUser
    }
    next()
  })
}

module.exports = setupAsyncLocalStorage

