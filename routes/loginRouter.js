import express from 'express'
const loginRouter = express.Router()

import {
    login,
    loginPost,
    logout
} from '../controllers/loginController.js'

loginRouter.get('/login', login)

loginRouter.post('/login', loginPost)

loginRouter.get('/logout', logout)




export default loginRouter