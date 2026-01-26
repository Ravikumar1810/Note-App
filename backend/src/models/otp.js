const mongoose  =  require("mongoose");
const  otpSchema =  new  mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
    },
    otp:{
        type:Number,
        required:true
    },
    expiredAt:{
        type: Date,
        index:5*60*1000,
    }
}, {timestamps:true});

module.exports = mongoose.model("OTP",  otpSchema);