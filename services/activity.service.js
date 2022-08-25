

const gActivities = require('../data/activity.json')
const PAGE_SIZE = 4
const gLabels = ["All", "On wheels", "Box game", "Art", "Baby", "Doll", "Puzzle", "Outdoor"]
const fs = require('fs')
const utilService = require('./util.service')

module.exports = {
    query,
    getById,
    save,
    remove,
    getEmptyActivity,
    getNumOfPages,
    getLabels
}

//filter
function query({ txt = '', pageIdx = 0, labels = [], sortBy = 'name', active = true, rating = 0 }) {
    let activities = gActivities
    if (txt) {
        const regex = new RegExp(txt, 'i')
        activities = activities.filter(activity => regex.test(activity.name) || regex.test(activity.ctg))
    }

    if (labels?.length > 0) {
        activities = activities.filter(activity => {
            return labels.every(label => {
                return activity.labels.includes(label);
            });
        })
    }


    if (active) {
        activities = activities.filter(activity => {
            return JSON.parse(active) === activity.active
        })
    }

    if (sortBy === 'name') {
        activities = activities.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
            else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
            return 0
        })

    } else if (sortBy === 'score') {
        activities = activities.sort((a, b) => a.score - b.score)
    } else {
        activities = activities.sort((a, b) => b.createdAt - a.createdAt)
    }

    // if (pageIdx !== undefined) {
    //     const startIdx = +pageIdx * PAGE_SIZE
    //     if (startIdx > activities.length - 1) return Promise.reject()
    //     activities = activities.slice(startIdx, startIdx + PAGE_SIZE)
    // }

    return Promise.resolve(activities)
}

function getLabels() {
    return gLabels
}

function getById(activityId) {
    const activity = gActivities.find(activity => activity._id === activityId)
    return Promise.resolve(activity)
}

function save(activity) {
    if (activity._id) {
        const idx = gActivities.findIndex(currActivity => currActivity._id === activity._id)
        gActivities[idx].name = activity.name
        gActivities[idx].score = activity.score
        gActivities[idx].img = activity.img
        gActivities[idx].active = activity.active
        gActivities[idx].labels = activity.labels
        gActivities[idx].rating = activity.rating
    } else {
        activity._id = utilService.makeId()
        gActivities.unshift(activity)
    }
    return _saveActivitiesToFile().then(() => activity)
}

function remove(activityId) {
    console.log('activityId', activityId)
    const idx = gActivities.findIndex(currActivity => currActivity._id === activityId)
    gActivities.splice(idx, 1)
    return _saveActivitiesToFile()
}

function getEmptyActivity() {
    return {
        name: '',
        score: 0,
        labels: [],
        createdAt: Date.now(),
        active: true,
        img: '',
        rating: 0
    }
}

function getNumOfPages() {
    return gActivities.length / PAGE_SIZE
    // return JSON.parse(localStorage.getItem(STORAGE_KEY)).length / PAGE_SIZE
}

function _saveActivitiesToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/activity.json', JSON.stringify(gActivities, null, 2), (err) => {
            if (err) {
                console.log(err)
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!')
                resolve()
            }
        })
    })
}
