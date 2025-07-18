import express from 'express'
const vocational_Auth_Routes = express.Router()

import { signup, signupPost, login, loginPost, logout, forgotPassword, forgotPasswordPost } from '../../controllers/Vocational_Course_Controllers/vocationalAuthControllers.js'


// Ex - https://domain.com/bca-2025-2028/signup
vocational_Auth_Routes.get("/:course-:courseSession/signup", signup)
vocational_Auth_Routes.post("/:course-:courseSession/signupPost", signupPost)

vocational_Auth_Routes.get("/vocational-student/login", login)
vocational_Auth_Routes.post("/vocational-student/loginPost", loginPost)

vocational_Auth_Routes.get("/vocational-student/logout", logout)

vocational_Auth_Routes.get("/vocational-student/forgot-password", forgotPassword)
vocational_Auth_Routes.post("/vocational-student/forgot-passwordPost", forgotPasswordPost)

export default vocational_Auth_Routes