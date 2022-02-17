import express from "express"
import mongoose from "mongoose"

const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const server = express()

//Initialise dotenv package
const dotenv = require("dotenv")
dotenv.config()

const PORT = process.env.PORT

mongoose.Promise = global.Promise
const conn = mongoose.connect(process.env.DATABASE_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

// Initialise db session store
const store = new MongoStore({
    uri: process.env.DATABASE_URI,

})

// Catch session store errors
store.on('error', (err) => {
    console.log(err)
})

// Session Initialisation
server.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
}))

server.use(express.json())
server.use(express.urlencoded({ extended: true }))


// // Create middleware to log user interactions
import { log } from './src/middleware/sessionLogController'
server.use((req, res, next) => {
    next()
    log(req, res)
})
//     console.log('running log - path: ' + req.path)
//     if(req.path === '/user/login' || req.path === "/index.html" || req.path === "/favicon.ico") return next()

//     // Check if user logged in
//     console.log(req.session)
//     if(req.session.email === 'undefined') {
//         return res.send({ message: "Please log in to proceed"})
//     }

//     const email = req.session.email
//     const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
//     const method = req.method
//     const userAgent = req.headers['user-agent']

//     const log = new SessionLog({
//         email: email,
//         ip: ip,
//         method: method,
//         userAgent: userAgent
//     })

//     log.save((err, log) => {
//         if(err){
//             console.log(err)
//         } else {
//             console.log(log)
//         }
//     })

//     console.log(req.headers['user-agent'])

//     next()
// })

// Allow static files
server.use(express.static('src/views'))

// Import controller
const routes = require("./src/routes/routes")
server.use("/", routes)

server.get("/", (req, res) => {
	res.send("This is a GET response.....")
})

server.listen(PORT, () => {
	console.log(`Server -> Server listening on port: ${PORT}`)
})
