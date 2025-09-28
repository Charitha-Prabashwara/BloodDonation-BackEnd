const User = require('../models/user.model');
const express = require('express');
const { default: mongoose } = require('mongoose');

const validator = require('validator');
const {sendVerifyEmail, sendForgotPasswordEmail} = require('../service/emailService');

const {successRes, errorRes} = require('../res/responseObject');
const {verifyJwt,createJWT} = require('../service/token');
const {salt, hash, compare} = require('../service/hashgen');

exports.searchDonors = async(req, res)=>{
    try {
        const {province, district, city, gender, age} = req.query;
        console.log(req.query)

        let query = {};

        if (province) query["address.province"] = province;
        if (district) query["address.district"] = district;
        if (city) query["address.city"] = city;
        if (gender) query["gender"] = gender.toLowerCase();
         console.log(query)
        const users = await User.find(query)
        .select("-account_activation_email -__v -password -access_token -refresh_token");

        if(users.length == 0){
            return errorRes(res, null, 'Not any donors found', 404)
        }

        successRes(res, users, "Sucess", 200);
        
    } catch (error) {
        return errorRes(res, null, error.message, 500)
    }
}