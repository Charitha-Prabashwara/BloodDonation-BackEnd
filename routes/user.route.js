const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/user.controller');
const Auth = require('../middleware/Auth');
const accessTokenVerify = require('../middleware/VerifyToken');

userRouter.post('/register', userController.signUpUser);
userRouter.post('/login', userController.signInUser);
userRouter.post('/access-token-verify', accessTokenVerify);

userRouter.post('/reset-password-request', userController.resetPasswordRequest)
userRouter.get('/reset-password', userController.resetPassword)

userRouter.get('/verify', userController.verify)

module.exports = userRouter;