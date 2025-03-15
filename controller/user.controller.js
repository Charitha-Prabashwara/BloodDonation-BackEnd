const User = require('../models/user.model');
const express = require('express');
const { default: mongoose } = require('mongoose');

const validator = require('validator');
const {sendVerifyEmail, sendForgotPasswordEmail} = require('../service/emailService');

const {successRes, errorRes} = require('../res/responseObject');
const {verifyJwt,createJWT} = require('../service/token');
const {salt, hash, compare} = require('../service/hashgen');



exports.signUpUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm_password } = req.body;

        if (!first_name || !last_name || !email || !password || !confirm_password) {
            return errorRes(res, null, 'All fields are required', 422);
        }

        if (!validator.isEmail(email)) {
            return errorRes(res, null, 'Invalid email address', 422);
        }

        if (!validator.equals(password, confirm_password)) {
            return errorRes(res, null, 'Passwords do not match', 422);
        }

        // Generate salt
        const passwordSalt = await salt(parseInt(process.env.SALT_ROUNDS));
        
        // Generate hash password with salt
        const passwordHash = await hash(password, passwordSalt);

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorRes(res, null, 'User account cannot be created with this email address.', 400);
        }

        // Create new user
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: passwordHash
        });

        const payload = { id: user._id.toString() };
        const token = await createJWT(payload, process.env.VERIFY_TOKEN_SECRET, process.env.VERIFY_TOKEN_LIFE_TIME)
        user.account_activation_email.send_time = Date.now();
        user.account_activation_email.token = token;
        
        await user.save();
        sendVerifyEmail(user.email, user.first_name, token);

        return successRes(res, user, 'User created successfully', 201);
    } catch (error) {
        return errorRes(res, error, 'Error creating user', 500);
    }
};


exports.verify = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return errorRes(res, null, "Token not provided", 422);
        }

        if (!validator.isJWT(token)) {
            return errorRes(res, null, "Invalid token provided", 422);
        }

        const payload = await verifyJwt(token, process.env.VERIFY_TOKEN_SECRET);
        const user = await User.findById(payload.id);

        if (!user || user.account_activation_email.token !== token || (user.account_email_verified && user.account_verified)) {
            return errorRes(res, null, "Your verification request is not valid", 400);
        }

        user.account_email_verified = true;
        user.account_verified = true;

        await user.save();
        return successRes(res, null, "User email and account verified", 200);
    } catch (error) {
        return errorRes(res, error, error.message || "An error occurred", 500);
    }
};

exports.signInUser = async(req, res)=>{
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            return errorRes(res, null, 'missing required fields.', 422);
        }

        if(!validator.isEmail(email)){
            return errorRes(res, null, 'invalid email address', 422);
        }

        if(validator.isEmpty(password)){
            return errorRes(res, null, 'invalid password', 422);
        }

        const user = await User.findOne({email:email, account_email_verified:true, account_verified:true, account_status:'active'});
        if(!user){
            return errorRes(res, null, 'invalid email or password', 400);
        }
      
       const result = await compare(password, user.password);
       if(!result){
        return errorRes(res, null, 'invalid email or password', 400);
       }

       const payload = {
            id:user._id,
            email: user.email,
            role:user.account_type
       }
       const access_token = await createJWT(payload, process.env.USER_TOKEN_ACCESS_SECRET, process.env.USER_TOKEN_ACCESS_LIFE_TIME);
       const refresh_token = await createJWT(payload, process.env.USER_TOKEN_REFRESH_SECRET, process.env.USER_TOKEN_REFRESH_LIFE_TIME);
       
       user.access_token =access_token;
       user.refresh_token =refresh_token;
       user.save();

       const responseObject = {
        access_token: access_token,
        refresh_token: refresh_token,
       }

       res.cookie('refreshToken', refresh_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 2592000000 // 30 days
        })
        .cookie('accessToken', access_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge:  3600000 // 1 hour
        },)
       return successRes(res, responseObject, 'login successful', 200);

    }catch(error){
        return errorRes(res, error, error.stack, 500);
    }
}

exports.resetPasswordRequest = async(req, res)=>{
    try{
        const {email} = req.body;
        if(!email){
            return errorRes(res, null, 'required fields', 422); 
        }

        if(!validator.isEmail(email)){
            return errorRes(res, null, 'invalid email address', 422); 
        }

        await User.findOne({email:email}).then(async(user)=>{
            if(!user){
                return errorRes(res, null, 'user not found', 404); 
            }
            const payload = {
                id:user._id,
                email:user.email
            }

            const token = await createJWT(payload, process.env.PASSWORD_REST_TOKEN_REFRESH_SECRET, process.env.PASSWORD_REST_LIFE_TIME);
            sendForgotPasswordEmail(user.email, token);

            return successRes(res, null, 'password reset request sent to email address', 200);
        }).catch((error)=>{
            return errorRes(res, error, error.message, 500); 
        })



    }catch(error){
        return errorRes(res, error, error.message, 500); 
    }
}

exports.resetPassword = async(req, res)=>{
    try {
        const {token, password, confirm_password} = req.body;

        if(!token||!password||!confirm_password){
            return errorRes(res, null, 'not found required fields.', 422); 
        }
    
        if(!validator.isJWT(token)){
            return errorRes(res, null, 'invalid request.', 422); 
        }
    
        if(!validator.equals(password, confirm_password)){
            return errorRes(res, null, 'password and confirm password not match', 422); 
        }
    
        await verifyJwt(token, process.env.PASSWORD_REST_TOKEN_REFRESH_SECRET).then((payload)=>{
    
            User.findById(payload.id).then(async(user)=>{
                if(!user){
                    return errorRes(res, null, 'invalid request.', 422);
                }
                 // Generate salt
                const passwordSalt = await salt(parseInt(process.env.SALT_ROUNDS));
                
                // Generate hash password with salt
                const passwordHash = await hash(password, passwordSalt);
                user.password = passwordHash;
                
                user.save().then(()=>{
                    successRes(res, null, 'password reset successfully', 200);
                }).catch((error)=>{
                    return errorRes(res, error, error.message, 500);
                })
            }).catch((error)=>{
                return errorRes(res, error, error.message, 500);
            })
        }).catch(()=>{
            return errorRes(res, null, 'invalid request.', 422);
        })
    } catch (error) {
        return errorRes(res, error, error.message, 500);
    }

   





};