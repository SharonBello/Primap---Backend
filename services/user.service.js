import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    save,
    // addActivity
}

window.us = userService

function save(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(user))
    return storageService.put(STORAGE_KEY, user)
}

function login(credentials) {
    return storageService.query(STORAGE_KEY).then(users => {
        const user = users.find(user => user.username === credentials.username &&
            user.password === credentials.password)
            _handleLogin(user)
        return user
    })
}

function signup(userInfo) {
    // userInfo.balance = 1000
    // userInfo.prefs = { color: '#0000ff', bgColor: '#c1c1c1' }
    // userInfo.activities = []

    return storageService.post(STORAGE_KEY, userInfo)
        .then((user) => {
            _handleLogin(user)
            return user
        })
}
// function updateBalance(diff) {

//     const user = userService.getLoggedinUser()
//     user.balance += diff
//     return storageService.put(STORAGE_KEY, user)
//         .then((user) => {
//             sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(user))
//             return user.balance
//         })
// }

function logout() {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, null)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _handleLogin(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(user))
}

// function (activity) {
//     let user = getLoggedinUser()
//     user = {...user, activities: [...user.activities, activity]}
//     return storageService.put(STORAGE_KEY, user)
    
// }

// Test Data

// userService.signup({
//     username: 'muki',
//     password: 'muki',
//     fullname: 'Muki Ja',
//     score: 10000,
//     prefs: { color: '#0000ff', bgColor: '#c1c1c1' },
//     activities: [{txt: 'Added an Activity', at: 1523873242735}]
// })

// userService.login({username: 'miki', password: 'miki'})


