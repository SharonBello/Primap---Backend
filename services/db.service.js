const MongoClient = require('mongodb').MongoClient

// const config = require('../config')
let config

if (process.env.NODE_ENV === 'production') {
    config = { 'dbURL': 'mongodb+srv://Sharon:Better@primap.dedgka6.mongodb.net/test' }
 } else {
    // config = { 'dbURL': 'mongodb://localhost:27017' }
    config = { 'dbURL': 'mongodb+srv://Sharon:Better@primap.dedgka6.mongodb.net/test' }
 }

// Database Name
const dbName = 'primap_db'

let dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await _connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}

module.exports = {
    getCollection
}



