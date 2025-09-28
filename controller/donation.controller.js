const Donation = require('../models/donation.model');
const express = require('express');
const { default: mongoose, mongo } = require('mongoose');
const {successRes, errorRes} = require('../res/responseObject');
const validator = require('validator');
const Camp = require('../models/camp.model');

exports.createDonation = async(req, res)=>{
    try {
        const donorId = req.body.donorId;
        const campId = req.body.campId;
        const {blood_group, volume} = req.body;

        //validate donor and camp id
        if(!mongoose.isValidObjectId(donorId)){
            return errorRes(res, "invalid donor id", "invalid donor id", 422);
        }
        if(!mongoose.isValidObjectId(campId)){
            return errorRes(res, "invalid camp id", "invalid camp id", 422);
        }

        await Donation.create({
            donor: donorId,
            camp: campId,
            blood_group: blood_group,
            volume: volume
        })
        .then((donation)=>{
            return successRes(res, donation, "", 201);
        })
        .catch((error)=>{
            return errorRes(res, error, error.message, 500);
        })


    } catch (error) {
        return errorRes(res, error, error.message, 500)
    }
}

exports.findDonations = async(req,res)=>{
    try{
        const fields = req.body;

        const donations = await Donation.find(fields).populate("donor camp");

        if(donations.length == 0){
            return errorRes(res, "not found", "not found", 404);
        }

        return successRes(res, donations, "", 200);
    }catch(error){
        return errorRes(res, error, error.message, 500);
    }
}

exports.getDonationById = async(req,res)=>{
    try {
        const id = req.params.id;
        //validate
        if(!mongoose.isValidObjectId(id)){
            return errorRes(req, "invalid id", "invalid id", 422);
        }

        const donation = await Donation.findById(id).populate("donor camp");
        if(!donation){
            return errorRes(res, "not found donation", "not found donation", 404);
        }

        return successRes(res, donation, "", 200);
    } catch (error) {
        return errorRes(res, error, error.message, 500)
    }
}

exports.getAllDonations = async(req, res)=>{
    try {
        const donations = await Donation.find().populate("donor camp");
        
        if(donations.length == 0){
            return errorRes(res, "not found", "not found", 404);
        }
        return successRes(res, donations, "", 200);
    } catch (error) {
        return errorRes(res, error, error.message, 500)
        
    }
}

exports.updateDonationById = async(req, res)=>{
    try {
        const id = req.params.id
        const fields = req.body;

        if(!mongoose.isValidObjectId(id)){
            return errorRes(res, "invalid donation id", "invalid donation id", 404)
        }
        await Donation.findByIdAndUpdate(id, fields, {new:true}).populate("donor camp")
        .then((donation)=>{
            return successRes(res, donation, "", 200);
        }).catch((error)=>{
            return errorRes(res, error, error.message, 500);
        })

    } catch (error) {
        return errorRes(res, error, error.message, 500);
    }
}

exports.deleteDonationById = async(req,res)=>{
    try {
        const id = req.params.id;
        if(!mongoose.isValidObjectId(id)){
            return errorRes(res, "invalid donation id", "invalid donation id", 422);
        }

        await Donation.findByIdAndDelete(id)
        .then((donation)=>{
            return successRes(res, donation, "", 200);
        })
        .catch((error)=>{
            return errorRes(res, error, error.message, 500);
        })
    } catch (error) {
        return errorRes(res, error, error.message, 500);
    }
}