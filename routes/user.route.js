const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/user.controller');

userRouter.post('/register', userController.signUpUser);

userRouter.get('/verify', userController.verify)
module.exports = userRouter;