const activityService = require('./activity.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getActivities(req, res) {
  try {
    logger.debug('Trying tog et activities')
    var queryParams = req.query;
    const activities = await activityService.query(queryParams)
    logger.debug('activity.controller 11 activities', activities)
    res.json(activities);
  } catch (err) {
    logger.error('Failed to get activities', err)
    res.status(500).send({ err: 'Failed to get activities' })
  }
}

// GET BY ID 
async function getActivityById(req, res) {
  try {
    const activityId = req.params.id;
    const activity = await activityService.getById(activityId)
    res.json(activity)
  } catch (err) {
    logger.error('Failed to get activity', err)
    res.status(500).send({ err: 'Failed to get activity' })
  }
}

// POST (add activity)
async function addActivity(req, res) {
  try {
    const activity = req.body;
    logger.info('from activity.controller - addActivity(req, res)', activity)
    const addedActivity = await activityService.add(activity)
    logger.info('from activity.controller - addActivity(req, res)', addedActivity)
    res.json(addedActivity)
  } catch (err) {
    logger.error('Failed to add activity', err)
    res.status(500).send({ err: 'Failed to add activity' })
  }
}

// POST (add review)
async function addReview(req, res) {
  try {
    const activity = req.body;
    const review = req.body;
    const addedReview = await activityService.addUserReview(activity, review)
    res.json(addedReview)
  } catch (err) {
    logger.error('Failed to add review', err)
    res.status(500).send({ err: 'Failed to add review' })
  }
}

// PUT (Update activity)
async function updateActivity(req, res) {
  try {
    const activity = req.body;
    const updatedActivity = await activityService.update(activity)
    res.json(updatedActivity)
  } catch (err) {
    logger.error('Failed to update activity', err)
    res.status(500).send({ err: 'Failed to update activity' })
  }
}

async function updateActivityRate(req, res) {
  try {
    const activity = req.body;
    const rating = req.body;
    console.log('activity.controller 75 - activity',activity )
    // console.log('activity.controller 75 - rating', rating ) 
    const updatedRate = await activityService.updateUserRating(activity, rating)
    console.log('activity.controller 75 - updatedRate',updatedRate )
    res.json(updatedRate)
  } catch (err) {
    logger.error('Failed to update activity', err)
    res.status(500).send({ err: 'Failed to update activity' })
  }
}

// DELETE (Remove activity)
async function removeActivity(req, res) {
  
  try {
    const activityId = req.params.id;
    const removedId = await activityService.remove(activityId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove activity', err)
    res.status(500).send({ err: 'Failed to remove activity' })
  }
}

module.exports = {
  getActivityById,
  addActivity,
  addReview,
  updateActivity,
  updateActivityRate,
  removeActivity
}
