import mongoose from 'mongoose'

const Schema = mongoose.Schema

const sessionLogSchema = new Schema({
    email: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    ip: {
        type: String,
        required: "Provide an IP Address",
    },
    method: {
        type: String,
        required: "Provide the HTTP request method"
    },
    path: {
        type: String,
        required: "Provide the path from the request"
    },
    userAgent: {
        type: String,
        required: "Provide the client's user agent"
    }
})

const SessionLog = mongoose.model('SessionLog', sessionLogSchema)

module.exports = SessionLog