import express from 'express'
const loginRouter = express.Router()

import {
    login,
    loginPost,
    logout,
    forgotPassword,
    forgotPasswordPost
} from '../controllers/loginController.js'

loginRouter.get('/login', login)

loginRouter.post('/login', loginPost)

loginRouter.get('/logout', logout)

loginRouter.get('/forgotPassword/:portal', forgotPassword)

loginRouter.post('/forgotPassword', forgotPasswordPost)




export default loginRouter