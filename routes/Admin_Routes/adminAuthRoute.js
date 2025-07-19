import express from 'express'
const admin_Auth_Route = express.Router()

import { login, loginPost, logout } from '../../controllers/Admin_Controllers/adminAuthController.js'

admin_Auth_Route.get("/login/:user", login)
admin_Auth_Route.post("/login/:user", loginPost)

admin_Auth_Route.get("/logout/:user", logout)

export default admin_Auth_Route