const express = require('express');
const testRouter = express.Router();


testRouter.get('/', (req, res)=>{
    return res.status(200).json({
        success: true,
        message: 'working'
    })
});

module.exports = testRouter