const express = require('express')
const app = express()
const http = require('http').createServer(app)

// const activityService = require('./services/activity.service.js')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

const logger = require('./services/logger.service')

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const activityRoutes = require('./api/activity/activity.routes')

const { setupSocketAPI } = require('./services/socket.service')

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/activity', activityRoutes)

setupSocketAPI(http)

// Last fallback
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
 })

// //new activity
// app.post('/api/activity', (req, res) => {
//     // const loggedUser = userService.validateToken(req.cookies.loginToken)
//     // if (!loggedUser) return res.status(401).send('Cannot add activity')

//     const activity = req.body
//     activityService.save(activity)
//         .then(savedActivity => res.send(savedActivity))
// })

const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})

