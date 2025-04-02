const {verifyJwt} = require('../service/token');
const {errorRes} = require('../res/responseObject');
const {unauthorizedResponse, authorizationHeaderMissed, invalidAuthFormat} = require('./MiddlewareExceptions/errorResponse');
class Auth{

    constructor(allowedAccess, superSure=false, logsEnable=false){
        this.allowedList = allowedAccess;
        this.superSure = superSure;
        this.logsEnable = logsEnable;
    }
    
    async authenticate( req, res, next){
        this.res = res;

        const requiredHeaders = (res.hasHeader("Authorization")) || (res.hasHeader("authorization"))
        if(requiredHeaders){
            return authorizationHeaderMissed(res)
        }
        
        const authHeader = (req.headers.Authorization || req.headers.authorization);
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return invalidAuthFormat(res)
        }       

        try {
            const accessToken = authHeader.split(" ")[1];
            const  verifyResult = await this.jwtVerify(accessToken);
            
            if(!verifyResult){return unauthorizedResponse(res)}
            
            const isAllowedAccess = this.isAllowedAccess();
            if(!isAllowedAccess){return unauthorizedResponse(res)};
    
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