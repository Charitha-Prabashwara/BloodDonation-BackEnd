const mongoose = require('mongoose');

const camp = new mongoose.Schema({
    name:{
        type:String,
        required:true
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
    location: {

        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
  },
    deleted:{
        type:Boolean,
        required:false,
        default:false
    }
});

const Camp = mongoose.model("Camp", camp);
module.exports = Camp;