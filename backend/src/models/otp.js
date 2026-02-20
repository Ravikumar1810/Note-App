const mongoose  =  require("mongoose");
const  otpSchema =  new  mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        index:true
    },
    otp:{
        type:Number,
        required:true
    },
   expiredAt: {
      type: Date,
      required: true,
      index: { expires: 0 }  
    },
    purpose:{
        type:String,
        enum:['signup','reset'],
        required:true
    }
}, {timestamps:true});

module.exports = mongoose.model("OTP",  otpSchema);




