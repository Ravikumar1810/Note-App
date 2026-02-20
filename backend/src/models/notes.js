 const  mongoose  =  require("mongoose");
const notesSchma =  new mongoose.Schema({
   userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    title:{
        type:String,
        required:true,
        trim:true,
        maxLength:100
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["completed", "incompleted"],
        default:'incompleted'
    },
 }, {timestamps : true})


 module.exports = mongoose.model("Note" , notesSchma)



