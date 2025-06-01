const User = require('../models/user.model');

const express = require('express');
const { default: mongoose } = require('mongoose');

const validator = require('validator');
const {sendVerifyEmail, sendForgotPasswordEmail} = require('../service/emailService');

const {successRes, errorRes} = require('../res/responseObject');
const {verifyJwt,createJWT} = require('../service/token');
const {salt, hash, compare} = require('../service/hashgen');
const donationApplication = require('../models/donationApplication.model');

exports.getAllDonationApplication = async(req,res)=>{
    try {
        const authUser = req.user;
        const {state}  = req.query;

        if(!state)
            return errorRes(res, null, 'application state not defined', 422)
        
        donationApplication.find({
            applicationState:state
        }).populate({
            path:'user',
            select: '-password -account_activation_email -account_type -account_status -account_verified -account_email_verified -verified_by_doctor -access_token -refresh_token -__v'


        })
        .then((applications)=>{
            if(!applications || applications.length===0){
                return errorRes(res, null, 'not found any application', 404)
            }
            return successRes(res, applications, null, 200);
        })
        .catch((error)=>{
            return errorRes(res, null, error.message, 500);
        })

    
        
    } catch (error) {
        return errorRes(res, null, error.message, 500);
    }
}

exports.getDonationApplicationById = async(req, res)=>{
    try {
        const id = req.params.id
        
        const application = await donationApplication.findById({
            _id:id
        })

        if(!application){
            errorRes(res, null, 'not found any application', 404)
        }

        successRes(res, application, null, 200)
        
    } catch (error) {
        errorRes(res, null, error.message, 500)
    }
}

exports.getDonationApplicationByUser = async(req,res)=>{

    try {
        const authUser = req.user;
        const application = await donationApplication.find({user:authUser.id}).sort({ createdAt: -1 }).exec();

        if(!application || application.length===0){
            return errorRes(res ,null , 'not found application', 404);
        }

        let history=[]

        application.map((application)=>{
            history.push({created:application.createdDate, status:application.applicationState, id: application._id})
        })
           
        
        const latestApplication = application[0]
        
        if(latestApplication.applicationState === 'rejected'){
            return successRes(res, {
                history: history,
                state:{
                    rejectedApplication: true
                }
            }, 'latest application rejected, now you can apply again', 200);
        }

        if(latestApplication.applicationState==='created'){
            return successRes(res, {
                history: history.length > 0 ? history : null,
                state:{
                    createApplication:true,
                    describe:"description"
                },
                application:latestApplication

            }, 'Your application sended to our staff, please wait until process your application',200)
        }

        return errorRes(res, null, 'not found application', 422);
    } catch (error) {
        return errorRes(res, null, error.message, 500)
    }
}

exports.createDonationApplication = async(req,res)=>{
    try {
        const data = req.body;
        const authUser = req.user;

        const applications = await donationApplication.find({user:authUser.id}).sort({ createdDate: -1 }).exec();

        if(applications.length>0){

            const application = applications[0];

            if(application.applicationState == 'created'){
                return errorRes(res, null, 'Your application under review process', 409)
            }

            if(application.applicationState == 'pass'){
                return errorRes(res, null, 'Your passed donation application already', 409)
            }
        }

        donationApplication.create({
            user: authUser.id,
            additionalInfo:data.additionalInfo,
            questions:{
                    q1:true,
                    q2:true,
                    q3:true,
                    q4:true, 
                    q5:true,
                    q6:true,
                    q7:true,
                    q8:true,
                    q9:true,
                    q10:true, 
                    q11:true,
                    q12:true,
                    q13:true,
            },
            birthday:data.birthday,
            bodyHight:data.bodyHight,
            bodyWeight:data.bodyWeight,
            applicationState:'created',
            createdDate:Date.now()
        })
        
        .then((application)=>{
            return successRes(res, application, 'Application submit successfully.', 201)
        })

        .catch((error)=>{
            return errorRes(res, null, error.message, 500)
        })

    } catch (error) {
        return errorRes(res, null, error.message, 500)
    }
}


exports.updateDonationApplication = (req,res)=>{
    try {
        
    } catch (error) {
        

    }
}

exports.deleteDonationApplication=(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}