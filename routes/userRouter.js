const express= require('express')
const userController= require('../controllers/userController')
const authController = require('../controllers/authController')
const router= express.Router()

router
.post('/signup', authController.signup)
router
.post('/login', authController.login)

router
.post('/forgotpassword', authController.forgotPassword)
router
.patch('/resetpassword/:token', authController.login)

router
.get('/', userController.getUsers) 

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.put(userController.updateUser)
.delete(userController.deleteUser)

module.exports= router

