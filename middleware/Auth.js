const jwt = require('jsonwebtoken');
const {verifyJwt} = require('../service/token');
const {successRes, errorRes} = require('../res/responseObject');
//const User = require("../../../Model/User/User");


class Auth{

    constructor(allowedAccess, superSure=false, logsEnable=false){
        this.allowedList = allowedAccess;
        this.superSure = superSure;
        this.logsEnable = logsEnable;
    }

    response(statusCode, success, message, details,){
        return this.res.status(statusCode).json({
            success: success,
            message: message,
            details:details
        });
       
    }

    async authenticate( req, res, next){
        this.res = res;

        const requiredHeaders = (res.hasHeader("Authorization")) || (res.hasHeader("authorization"))
        if(requiredHeaders){
            return errorRes(res, null, 'Authorization header is missing.', 422)
        }
        
        const authHeader = (req.headers.Authorization || req.headers.authorization);
        
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return errorRes(res, null, 'Invalid authorization format', 422)
        }       

        try {
            const accessToken = authHeader.split(" ")[1];
            const  verifyResult = await this.jwtVerify(accessToken);
            
            if(!verifyResult){
                return errorRes(res, null, 'User is not authorized.', 401);
            }
            
            const isAllowedAccess = this.isAllowedAccess();
            if(!isAllowedAccess){
                return errorRes(res, null, 'Access denied', 401); 
            };
    
            req.user= {email: this.email,id: this.id,role: this.role}
            next();
        } catch (error) {
            return errorRes(res, null, 'Internal server error', 500);
        }  
    }

    isAllowedAccess() { 
        return this.allowedList.includes(this.role);
    }

    async jwtVerify(accessToken) {

         return verifyJwt(accessToken, process.env.USER_TOKEN_ACCESS_SECRET).then((payload)=>{
            this.id = payload.id;
            this.email = payload.email;
            this.role = payload.role;
            return true;
        }).catch((error)=>{
            return false
        })
    }


}

module.exports = Auth;