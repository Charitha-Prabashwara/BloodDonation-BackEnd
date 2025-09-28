const express = require('express');
const donationRouter = express.Router();
const donationController = require('../controller/donation.controller');
const Auth = require('../middleware/Auth');

donationRouter.post('/', donationController.createDonation);
donationRouter.get("/", donationController.getAllDonations);
donationRouter.get("/:id", donationController.getDonationById);
donationRouter.get("/find/filter", donationController.findDonations);
donationRouter.put("/:id", donationController.updateDonationById);
donationRouter.delete("/:id", donationController.deleteDonationById);

//donationRouter.delete("/:id", (req, res, next) => new Auth(['doctor'], false, false).authenticate(req, res, next), donationController.deleteDonationById);
module.exports = donationRouter;