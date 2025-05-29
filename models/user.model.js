const mongoose = require('mongoose');

const user = new mongoose.Schema({

    nic:{
        type:String,
        required:false,
        minlength:10,
        maxlength:12,
        select:true
    },
    first_name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
        select:true
    },
    last_name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
        select:true
    },
    phone_number:{
        type:String,
        required:false,
        unique:true,
        sparse: true,
        minlength:10,
        maxlength:10,
        select:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength:50,
        select:true
    },
    account_type:{
        type:String,
        required:true,
        enum:['user','donor', 'doctor', 'assistant'],
        default:'user',
        select:true
       
    },
    account_status:{
        type:String,
        required:true,
        enum:['active','inactive','blocked'],
        default:'active',
    },
    account_verified:{
        type:Boolean,
        required:false,
        default:false
    },
    account_email_verified:{
        type:Boolean,
        required:false,
        default:false,
        select:true
    },
    account_activation_email:{
        send_time:{
            type:Date,
            required:false
            
        },
        
        token:{
            type:String,
            required:false
        }
    },
    account_password_reset_token:{
        otp_send_time:{
            type:Date,
            required:false
        },
        token:{
            type:String,
            required:false
        }
        
       
    },

    password:{
        type:String,
        required:true,
    },

    access_token:{
        type:String,
        required:false,
       
    },
    refresh_token:{
        type:String,
        required:false,
        
    },

    name_with_initials:{
        type:String,
        required:false,
        select:true
    },
    full_name:{
        type:String,
        required:false,
        select:true
    },
    address:{
        
        province:{
            type:String,
            required:false,
            select:true
        },
        district:{
            type:String,
            required:false,
            select:true
        },
        city:{
            type:String,
            required:false,
            select:true
        },
        postal_code:{
            type:String,
            required:false,
            select:true
        },
        address_line1:{
            type:String,
            required:false,
            select:true
        },
        address_line2:{
            type:String,
            required:false,
            select:true
        },
       
    },
    blood_group:{
        type:String,
        required:false,
        enum:['A+','A-','B+','B-','AB+','AB-','O+','O-'],
    },
    last_blood_donated_date:{
        type:Date,
        required:false,
    },
    last_blood_donated_location:{
        type:String,
        required:false,
    },
    rest_period_days:{
        type:Number,
        required:false
    },
    is_donor_available:{
        type:Boolean,
        required:false,
    },
    verified_by_doctor:{
        type:Boolean,
        required:false,
        default:false,
    },
    gender:{
        type:String,
        required:false,
        enum:['male','female','other'],
        select:true
    }
});

const User = mongoose.model('User', user);
module.exports = User;