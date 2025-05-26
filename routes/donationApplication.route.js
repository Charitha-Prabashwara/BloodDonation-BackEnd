const express = require('express');
const donationApplicationRouter = express.Router();
const userController = require('../controller/user.controller');
const donationApplicationController = require('../controller/application.controller')
const Auth = require('../middleware/Auth');
const handleUpload = require('../middleware/multerMiddleware');
const {accessTokenVerify, refreshTokenVerify} = require('../middleware/VerifyToken');


donationApplicationRouter.get('/id/:id', donationApplicationController.getDonationApplicationById);
donationApplicationRouter.get('/all',  donationApplicationController.getAllDonationApplication);
donationApplicationRouter.post('/create', (req, res, next) => new Auth(['user'], false, false).authenticate(req, res, next), donationApplicationController.createDonationApplication)
donationApplicationRouter.get('/getSpecific', (req, res, next) => new Auth(['user'], false, false).authenticate(req, res, next), donationApplicationController.getDonationApplicationByUser);





module.exports = donationApplicationRouter;