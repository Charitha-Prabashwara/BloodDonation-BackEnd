const express = require('express');
const doctorRouter = express.Router();
const donorController = require('../controller/donor.controller');
const Auth = require('../middleware/Auth');
const {accessTokenVerify, refreshTokenVerify} = require('../middleware/VerifyToken');

doctorRouter.get('/search', (req, res, next) => new Auth(['doctor'], false, false).authenticate(req, res, next), donorController.searchDonors);

module.exports = doctorRouter;