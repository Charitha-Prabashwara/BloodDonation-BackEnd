const mongoose = require('mongoose');

const user = new mongoose.Schema({

    nic:{
        type:String,
        required:false,
        unique:true,
        minlength:10,
        maxlength:12,
    },
    first_name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
    },
    last_name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
    },
    phone_number:{
        type:String,
        required:false,
        unique:true,
        minlength:10,
        maxlength:10,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength:50,
    },
    account_type:{
        type:String,
        required:true,
        enum:['user','donor', 'doctor', 'assistant'],
        default:'user',
       
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
    },
    full_name:{
        type:String,
        required:false,
    },
    address:{
        province:{
            type:String,
            required:false,
        },
        district:{
            type:String,
            required:false,
        },
        city:{
            type:String,
            required:false,
        },
        postal_code:{
            type:String,
            required:false,
        },
        address_line1:{
            type:String,
            required:false,
        },
        address_line2:{
            type:String,
            required:false,
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
    },
});

const User = mongoose.model('User', user);
module.exports = User;