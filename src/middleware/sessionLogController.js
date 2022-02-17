import SessionLog from '../models/sessionLogModel'
export const log = (req, res) => {
    console.log('running log - path: ' + req.path)

    // Check if user logged in
    console.log(req.session)
    if(req.session.email === 'undefined') {
        return res.send({ message: "Please log in to proceed"})
    }

    const email = req.session.email
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const method = req.method
    const path = req.path
    const userAgent = req.headers['user-agent']

    const log = new SessionLog({
        email: email,
        ip: ip,
        method: method,
        path: path,
        userAgent: userAgent
    })

    log.save((err, log) => {
        if(err){
            console.log(err)
        } else {
            console.log(req.session)
            console.log(log)
        }
    })
}