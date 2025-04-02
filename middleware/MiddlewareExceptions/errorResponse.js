const {errorRes} = require('../../res/responseObject');

exports.unauthorizedResponse =(res)=>{
    return errorRes(res, null, 'Unauthorized', 401);
}

exports.authorizationHeaderMissed =(res)=>{
    return errorRes(res, null, 'Authorization header is missing.', 422)
} 

exports.invalidAuthFormat =(res)=>{
    return errorRes(res, null, 'Invalid authorization format', 422)
}






 

