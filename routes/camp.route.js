const express = require('express');
const campRouter = express.Router();
const campController = require('../controller/camp.controller');
const Auth = require('../middleware/Auth');

campRouter.post('/', campController.createCamp);
campRouter.get("/", campController.findAllCamps);
campRouter.get("/:id", campController.getCampById);
campRouter.get("/find/filter", campController.findCamp);
campRouter.put("/:id", campController.updateCampById);
campRouter.delete("/:id", campController.deleteCampById);
//campRouter.delete("/:id", (req, res, next) => new Auth(['doctor'], false, false).authenticate(req, res, next), campController.deleteCampById);
module.exports = campRouter;