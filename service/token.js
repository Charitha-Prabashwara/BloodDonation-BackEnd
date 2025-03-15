const jwt = require("jsonwebtoken");
exports.verifyJwt = async(token, secret) => {
            return new Promise((resolve, reject) => {
                jwt.verify(token, secret, (error, payload) => {
                    if (error) return reject(error);
                    resolve(payload);
                });
            });
        };


exports.createVerifyJWT = async(payload, secret, tokenLifeTime)=>{
    return new Promise((resolve, reject)=>{
            jwt.sign(payload, secret, { expiresIn: tokenLifeTime }, (error, token)=>{
                if(error){
                    reject(error)
                }else{
                    resolve(token)
                }
            });
    });
};
