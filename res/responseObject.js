const express = require('express');

exports.successRes = async(res,data=null, message, code = 200) => {
    res.status(code).json({
        success:true,
        message:message,
        data:data
    })
};

exports.errorRes = async(res, error=null, message, code)=>{
    res.status(code).json({
        success:false,
        message:message,
        error:error
    })
}



