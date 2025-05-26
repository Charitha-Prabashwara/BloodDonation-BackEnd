const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/user.controller');
const Auth = require('../middleware/Auth');
const {accessTokenVerify, refreshTokenVerify} = require('../middleware/VerifyToken');

userRouter.post('/register', userController.signUpUser);
userRouter.post('/login', userController.signInUser);
userRouter.post('/access-token-verify', accessTokenVerify);
userRouter.post('/refresh-access-token', refreshTokenVerify, userController.refreshAuth)
userRouter.post('/reset-password-request', userController.resetPasswordRequest)
userRouter.post('/reset-password', userController.resetPassword)

userRouter.post('/verify', userController.verify)

userRouter.get('/profile', (req, res, next) => new Auth(['user'], false, false).authenticate(req, res, next), userController.getUserProfile);
userRouter.put('/profile', (req, res, next) => new Auth(['user'], false, false).authenticate(req, res, next), userController.setUserProfile);

module.exports = userRouter;