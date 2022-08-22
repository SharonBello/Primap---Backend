const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getActivityById, addActivity, updateActivity, removeActivity, updateActivityRate } = require('./activity.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log)
router.get('/:id', getActivityById)
router.post('/', requireAuth, requireAdmin, addActivity)
router.put('/', requireAuth, updateActivityRate)
router.put('/:id', requireAuth, requireAdmin, updateActivity)
router.delete('/:id',requireAdmin, requireAuth, removeActivity)

module.exports = router