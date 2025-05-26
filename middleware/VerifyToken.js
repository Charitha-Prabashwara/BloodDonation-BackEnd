const {verifyJwt} = require('../service/token');
const {successRes, errorRes} = require('../res/responseObject');
const User = require('../models/user.model');
const {unauthorizedResponse, authorizationHeaderMissed, invalidAuthFormat} = require('./MiddlewareExceptions/errorResponse');
const validator = require('validator');
const checkDatabase = async(accessToken, userId)=>{
    return User.findOne({_id:userId, account_email_verified:true, account_verified:true, account_status:'active'}).then((user)=>{
        if(user.access_token != accessToken){return false}
        return true;
    }).catch((error)=>{
        throw new Error(error);
    })
}

const checkDatabaseForRefreshToken = async(refreshToken, userId)=>{
    return User.findOne({_id:userId, account_email_verified:true, account_verified:true, account_status:'active'}).then((user)=>{
        if(user.refresh_token != refreshToken){return false}
        return true;
    }).catch((error)=>{
        throw new Error(error);
    })
}

exports.accessTokenVerify = async(req, res, next) =>{
    try{
        const requiredHeaders = (res.hasHeader("Authorization")) || (res.hasHeader("authorization"))
    
        if(requiredHeaders){return authorizationHeaderMissed(res)}
                
        const authHeader = (req.headers.Authorization || req.headers.authorization);  
        if(!authHeader || !authHeader.startsWith("Bearer")){return invalidAuthFormat(res)} 
        
        const accessToken = authHeader.split(" ")[1];

        const  verifyResult = await verifyJwt(accessToken, process.env.USER_TOKEN_ACCESS_SECRET)
        .then((payload)=>{return payload}).catch(()=>{return false});
                    
        if(!verifyResult){return unauthorizedResponse(res)}

        const result = await checkDatabase(accessToken, verifyResult.id);
        if(!result){return unauthorizedResponse(res)}

        return successRes(res, null, 'verified', 200);
    }catch(error){
        errorRes(res, error, error.message, 500);
    }   
}

exports.refreshTokenVerify = async(req, res, next) =>{
    try{
       const refreshToken = req.cookies.refreshToken; 
       
       if(!refreshToken){
        return errorRes(res, null, "Unauthorized credentials does not provided.", 401)
       }

       if(!validator.isJWT(refreshToken)){
            return errorRes(res, null, "Invalid credentials", 401)
       }
       
       //refresh token validation process
       

        const  verifyResult = await verifyJwt(refreshToken, process.env.USER_TOKEN_REFRESH_SECRET)
        .then((payload)=>{return payload}).catch(()=>{return false});
               
        if(!verifyResult){return unauthorizedResponse(res)}

        // const result = await checkDatabase(refreshToken, verifyResult.id);
        // if(!result){return unauthorizedResponse(res)}

        req.user = verifyResult;
        next()
    }catch(error){
        errorRes(res, error, error.message, 500);
    }   
}
