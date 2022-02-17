import User from "../models/userModel"
import bcrypt from "bcrypt"

export const getUsers = (req, res) => {
	User.find({}, (err, user) => {
		if (err) {
			return res.status(400).send({
				message: err,
			})
		} else {
			user.hashPassword = undefined
			return res.status(200).json(user)
		}
	})
}

export const addNewUser = (req, res) => {
	const newUser = new User(req.body)
	newUser.hashPassword = bcrypt.hashSync(req.body.hashPassword, 10)

	newUser.save((err, user) => {
		if (err) {
			return res.status(400).send({
				message: err,
			})
		}
		user.hashPassword = undefined
		return res.status(201).json(user)
	})
}

export const getUserById = (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) {
			res.status(400).send({ message: err })
		} else {
			user.hashPassword = undefined
			res.status(200).json(user)
		}
	})
}

export const updateUser = (req, res) => {
	User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false }, (err, user) => {
		if (err) {
			res.status(400).send({
				message: err,
			})
		} else {
			user.hashPassword = undefined
			res.status(200).json(user)
		}
	})
}

export const deleteUser = (req, res) => {
	User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
		if (err) {
			res.status(400).send({
				message: err,
			})
		} else {
			user.hashPassword = undefined
			res.status(200).json(user)
		}
	})
}

export const login = (req, res) => {
    const email = req.body.email
    console.log(`Initial Session Values -> `, req.session, `Body -> `, req.body)

    // Check that user exists
    User.find({}, (err, users) => {
        if (err) {
            res.status(400).send({
                message: err
            })
            return
        } else {
            let user = users.filter(user => user.email === email)
           
            if(!user || user.length != 1) {
                res.status(400).send({ message: "Login failed: Email or Password are incorrect"})
                return
            }
            user = user[0]
            console.log(`User found: `, user)
            
            const userInstance = new User(user)
            if(!userInstance.comparePassword(req.body.password, user.hashPassword)){
                res.send({ message: "Login failed: Email or Password are incorrect"})
                return
            }

            // User authenticated, set session data
            req.session.email = email
            console.log(`Post Session Values -> `, req.session)

            user.hashPassword = undefined
            res.status(200).json({ message: "Login successful" })
            
            
        }
    })
}

export const logout = (req, res) => {
    req.session.destroy()
    console.log("Session destroyed")
    if(!req.session){
        res.status(200).send({ message: "Logged out successfully"})
        return
    }

    res.status(500).send({ message: "An unexpected error occured. Please try again."})
}