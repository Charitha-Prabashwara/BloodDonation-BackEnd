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

        if(first_name.length > 30){
            return errorRes(res, null, 'First name length too long, max:30', 422);
        }

        if(last_name.length > 30){
            return errorRes(res, null, 'Last name length too long, max:30', 422);
        }

        if (!validator.equals(password, confirm_password)) {
            return errorRes(res, null, 'Passwords do not match', 422);
        }

        if(password.length < 6 || confirm_password.length < 6){
            return errorRes(res, null, 'Password length is too small', 422);
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

        return successRes(res, user, 'User account created.', 201);
    } catch (error) {
        return errorRes(res, error, error.message, 500);
    }
};


exports.verify = async (req, res) => {
    try {
        const { token } = req.body;

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
        return errorRes(res, null, 'invalid email or password', 401);
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

       const response = {
        user:{
            _id:user._id,
            email:user.email,
            role:user.account_type,
            first_name: user.first_name,
            last_name: user.last_name
        },
        accessToken: access_token
       }

       res.cookie('refreshToken', refresh_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 2592000000 // 30 days
        })
       return successRes(res, response, 'Login successful', 200);

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
            return errorRes(res, null, 'invalid request. rrrrr', 422); 
        }
    
        if(!validator.equals(password, confirm_password)){
            return errorRes(res, null, 'password and confirm password not match', 422); 
        }
    
        await verifyJwt(token, process.env.PASSWORD_REST_TOKEN_REFRESH_SECRET).then((payload)=>{
            console.log(payload)
            User.findById(payload.id).then(async(user)=>{
                if(!user){
                    return errorRes(res, null, 'invalid request. eee', 422);
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
        }).catch((error)=>{
            return errorRes(res, null, error.message, 422);
        })
    } catch (error) {
        return errorRes(res, error, error.message, 500);
    }

};

/*
 * find user by id(validate user is verified, verified by doctor, active, not blocked) 
 * every user must available, verified, active, not blocked
 * if user is verified by doctor, can;t update nic, 'name_with_initials', 'nic, 'full_name'
 * if user is not verified by dictor, can update all fields.
 * 
 * 
 * nic:-
 *     [1], validate gender using nic,
 *     [2], validate birthdate using nic,
 *     [3], validate nic using nic
 * 
 * phone_number-
 *     [1], validate phone number(all international standerds are allowed)
 *     [2], validate phone number using phone number

 * if req.user isn't available, return error(unauthorized access)
 * all fields are not required.
*/
exports.getUserProfile = async(req, res)=>{
   
    const auth_user = req.user;
    
    try{
        //if(!auth_user){return errorRes(res, null, 'unauthorized access', 401)}

        //find user by id(validate user is verified, verified by doctor, active, not blocked) 
        //every user must available, verified, active, not blocked
       
        const user = await User.findById(auth_user.id, {account_verified:true, account_email_verified:true, account_status:'active'}).then((user)=>{
           

            
        return successRes(res, {
                first_name: user.first_name,
                last_name: user.last_name,
                full_name: user.full_name,
                name_with_initials: user.name_with_initials,
                nic: user.nic,
                gender: user.gender,
                phone_number:user.phone_number,
                address: user.address
                
            }, null, 200);
        }).catch((error)=>{
            return errorRes(res, null, 'Can not find your records', 404)
        });

    }catch(error){
        return errorRes(res, error, error.message, 500);

    }

}

exports.setUserProfile = async(req, res)=>{
    const data = req.body;
    const auth_user = req.user;

    try {
        User.findByIdAndUpdate(auth_user.id, {
            
            first_name:data.first_name,
            last_name:data.last_name,
            full_name:data.full_name,
            name_with_initials:data.name_with_initials,
            nic:data.nic,
            phone_number:data.phone_number,
            address:data.address,
            gender:data.gender
        },{
            account_verified:true,
            account_email_verified:true,
            account_status:'active'
        })

        .then((user)=>{
             return successRes(res, null, "User has been updated", 200);
        })

        .catch((error)=>{
            return errorRes(res, error, error.stack, 500);
        })
    } catch (error) {
        
    }
}

exports.refreshAuth = async(req, res)=>{

    try {
      const userId = req.user.id;
        
      if(!userId){
        errorRes(res, null, 'Unauthorized1', 400)
      }

      if(!mongoose.isValidObjectId(userId)){
        errorRes(res, null, "Unauthorized2 ", 400)
      }

      //find verified active user
      const user = await User.findById(userId, {account_verified:true, account_email_verified:true, account_status:'active'})

      if(!user){
         errorRes(res, null, "Unauthorized3 ", 400)
      }

      const payload = {
            id:user._id,
            email: user.email,
            role:user.account_type
       }
     

      const access_token = await createJWT(payload, process.env.USER_TOKEN_ACCESS_SECRET, process.env.USER_TOKEN_ACCESS_LIFE_TIME);
      user.access_token =access_token;
      user.save();
      
      const response = {
        user:{
            _id:user.id,
            email:user.email,
            role:user.account_type,
            first_name: user.first_name,
            last_name: user.last_name
        },
        accessToken: access_token
       }
      
       successRes(res, response, null, 201);

    } catch (error) {
       errorRes(res, null, error.message, 500) 
    }
    
}

exports.logout = async(req,res)=>{
    const authUser = req.auth;
    res.clearCookie('refreshToken');
    successRes(res, null, 'Cookie removed successfully!',200)   
}