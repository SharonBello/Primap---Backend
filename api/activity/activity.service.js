const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('activity')

        let sortBy = filterBy.sortBy 
        let sortType = 1
        if(sortBy === 'recent') {
            sortBy = 'createdAt'
            sortType = -1
        }
        let activities = await collection.find(criteria).sort({[sortBy]:sortType}).toArray()

        return activities
    } catch (err) {
        logger.error('cannot find activities', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    let criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                name: txtCriteria
            }
        ]
    }
    if (filterBy.labels.length) {
        const labels = filterBy.labels.split(',')
        criteria.labels = {$all: labels}
    }

    if (filterBy.active) {
        criteria.active =  JSON.parse(filterBy.active)
    }
    return criteria
}

async function getById(activityId) {
    try {
        const collection = await dbService.getCollection('activity')
        const activity = collection.findOne({ _id: ObjectId(activityId) })
        return activity
    } catch (err) {
        logger.error(`while finding activity ${activityId}`, err)
        throw err
    }
}

async function remove(activityId) {
    try {
        const collection = await dbService.getCollection('activity')
        await collection.deleteOne({ _id: ObjectId(activityId) })
        return activityId
    } catch (err) {
        logger.error(`cannot remove activity ${activityId}`, err)
        throw err
    }
}

async function add(activity) {
    // TODO - add activity. description with make lorem
    try {
        const collection = await dbService.getCollection('activity')
        await collection.insertOne(activity)
        return activity
    } catch (err) {
        logger.error('cannot insert activity', err)
        throw err
    }
}

async function update(activity) {
    
    try {
        let id = ObjectId(activity._id)
        delete activity._id
        const collection = await dbService.getCollection('activity')
        await collection.updateOne({ _id: id }, { $set: { ...activity } })
        return activity
    } catch (err) {
        logger.error(`cannot update activity ${activityId}`, err)
        throw err
    }
}

async function updateUserRating(activity, rating) {
    try {
        let id = ObjectId(activity._id)
        const collection = await dbService.getCollection('activity')
        const updatedActivity = await collection.updateOne({ _id: id }, { $set: { ...activity, rating: rating } })
        console.log('activity.service - 134 activity', activity)
        console.log('activity.service - 135 updatedActivity', updatedActivity)
        return updatedActivity
    } catch (err) {
        logger.error('cannot add rating', err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    updateUserRating
}