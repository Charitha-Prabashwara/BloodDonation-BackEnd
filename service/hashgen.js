const bcrypt = require('bcrypt');

exports.salt = async(saltRounds)=>{
       return await bcrypt.genSalt(parseInt(saltRounds));
}

exports.hash = async(password, salt)=>{
        return await bcrypt.hash(password, salt);
}


exports.compare = async(password, comparePassword)=>{
        return await bcrypt.compare(password, comparePassword);
}