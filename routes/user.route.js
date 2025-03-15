const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/user.controller');
const Auth = require('../middleware/Auth');
userRouter.post('/register', userController.signUpUser);
userRouter.post('/login', userController.signInUser);

userRouter.post('/reset-password-request', userController.resetPasswordRequest)
userRouter.get('/reset-password', userController.resetPassword)

userRouter.get('/verify', userController.verify)

module.exports = userRouter;