const mongoose = require('mongoose');

const donation = new mongoose.Schema({
    donor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'donor id is required'],
       
    },

    camp:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camp',
        required: [true, 'camp id is required'],
        
    },

    blood_group:{
        type:String,
        required:false,
        enum:['A+','A-','B+','B-','AB+','AB-','O+','O-'],
    },

    volume:{
        type:Number,
        required:false,
    },

    
},{
    timestamps: true
});

const Donation = mongoose.model("Donation", donation);
module.exports = Donation;