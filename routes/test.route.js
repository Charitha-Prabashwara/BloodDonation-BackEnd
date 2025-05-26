const express = require('express');
const testRouter = express.Router();


testRouter.post('/', (req, res)=>{
    return res.status(200).json({
        success: true,
        message: 'working'
    })
});

module.exports = testRouter