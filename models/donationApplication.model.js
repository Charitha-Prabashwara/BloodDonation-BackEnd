const mongoose = require('mongoose')

const donationApplicationSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    birthCertificate:{
        front:{type:String,required:false},
        back:{type:String,required:false}
    },
    nic:{
        front:{type:String,required:false},
        back:{type:String,required:false}
    },
    additionalInfo:{type:String,default:'',required:false},
    questions:{
        q1:{type:Boolean,required:true},
        q2:{type:Boolean,required:true},
        q3:{type:Boolean,required:true},
        q4:{type:Boolean,required:true}, 
        q5:{type:Boolean,required:true},
        q6:{type:Boolean,required:true},
        q7:{type:Boolean,required:true},
        q8:{type:Boolean,required:true},
        q9:{type:Boolean,required:true},
        q10:{type:Boolean,required:true}, 
        q11:{type:Boolean,required:true},
        q12:{type:Boolean,required:true},
        q13:{type:Boolean,required:true},
    },

    birthday:{type:Date,required:true},
    bodyHight:{type:Number, required:true},
    bodyWeight:{type:Number, required:true},

    applicationState:{
        type:String,
        required:true,
        enum:['created', 'pass', 'rejected']

    },

    createdDate:{
        type:Date,
        default: Date.now()

    }
 
},)

const donationApplication = mongoose.model('donationApplication', donationApplicationSchema)
module.exports = donationApplication;