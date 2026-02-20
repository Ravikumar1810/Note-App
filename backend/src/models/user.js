const mongoose  = require("mongoose");
const  userSchema  = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        unique:true,
        trim:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
   refreshtoken:{
    type:String,
    default:''
   }
})


module.exports = mongoose.model("User", userSchema);