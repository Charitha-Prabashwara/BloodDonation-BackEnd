const Camp = require('../models/camp.model');
const express = require('express');
const { default: mongoose } = require('mongoose');
const {successRes, errorRes} = require('../res/responseObject');
const validator = require('validator');

exports.createCamp = async(req, res)=>{
    const name = req.body.name;
    const {province, district, city, address_line1, address_line2} = req.body.address;
    const {type, coordinates} = req.body.location;

    try {
        await Camp.create({
            name: name,
            address:{
                province: province,
                district: district,
                city: city,
                address_line1:address_line1,
                address_line2:address_line2
            },
            location:{
                type:type,
                coordinates:coordinates
            }
        }).then((camp)=>{
            successRes(res, camp, "new camp created success", 201);
        }).catch((error)=>{
            return errorRes(res, error, error.message, 500)
        })
        
    } catch (error) {
        return errorRes(res, error, error.message, 500)
    }
}

exports.getCampById = async(req, res)=>{
    const id = req.params.id;
    try {
        
        //validate objectid
        if(!mongoose.isValidObjectId(id)){
            return errorRes(res, "", "camp id is not valid", 422);
        }

        const camp = await Camp.findById(id);
        if(!camp){
            return errorRes(res, "", "camp is not found", 404);
        }

        return successRes(res, camp, "", 200);
    } catch (error) {
        return errorRes(res, error.message, "", 500)
    }
}

exports.findCamp = async(req,res)=>{
    try {
        const fields = req.body;
        const camps = await Camp.find(fields);
        if(camps.length == 0){
            return errorRes(res, "camp not found", "camp not found", 404)
        }
        return successRes(res, camps, "", 200);
    } catch (error) {
        return errorRes(res, error.message, "", 500)
    }
}

exports.updateCampById = async(req, res)=>{
    try {
        const id = req.params.id
        const field = req.body;

        //validate object id
        if(!mongoose.isValidObjectId(id)){
            return errorRes(res, "invalid object id", "invalid object id", 422);
        }

        const camp = await Camp.findByIdAndUpdate(id, field,{ new: true } )
 
        if(!camp){
            return errorRes(res, "not found", "not found", 404);
        }
        return successRes(res, camp, "camp updated success", 200);
    } catch (error) {
        return errorRes(res, error.message, "", 500);
    }
}

exports.findAllCamps = async(req, res)=>{
    try {
        const camps  = await Camp.find();
        if(camps.length==0){
            return errorRes(res, "Camp not found", "Camp not found", 404);
        }
        return successRes(res, camps, "", 200);
    } catch (error) {
        return errorRes(res, error.message, "", 500);
    }
}

exports.deleteCampById = async(req,res)=>{
    try {
        const id = req.params.id;
        //validate
        if(!mongoose.isValidObjectId(id)){
            return errorRes(res, "", "invalid object id", 422)
        }

        await Camp.findByIdAndDelete(id)
        .then((camp)=>{
            return successRes(res, camp, "", 200);
        })
        .catch((error)=>{
            return errorRes(res, error.message, "", 500);
        })

    } catch (error) {
        return errorRes(res, error.message, "", 500);
    }
}