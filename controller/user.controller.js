const User = require('../models/user.model');
const express = require('express');
const { default: mongoose } = require('mongoose');

const validator = require('validator');
const {sendVerifyEmail} = require('../service/emailService');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {successRes, errorRes} = require('../res/responseObject');
const {verifyJwt,createVerifyJWT} = require('../service/token');


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
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        
        // Generate hash password with salt
        const hash = await bcrypt.hash(password, salt);

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
            password: hash
        });

        const payload = { id: user._id.toString() };
        const token = await createVerifyJWT(payload, process.env.VERIFY_TOKEN_SECRET, process.env.VERIFY_TOKEN_LIFE_TIME)
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
