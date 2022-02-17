import express from "express"
import { addNewUser, getUsers, getUserById, updateUser, deleteUser, login, logout } from "../middleware/userController"
const router = express.Router()

router.route("/user/")
    .get(getUsers)
    .post(addNewUser)

router.post('/user/login', login)

router.get('/user/logout', logout)

router.route("/user/:id")
        .get(getUserById)
        .put(updateUser)
        .delete(deleteUser)



module.exports = router
