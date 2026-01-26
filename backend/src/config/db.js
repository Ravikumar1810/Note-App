const  mongoose =  require("mongoose");
require("dotenv").config();

const connectDB = async(req, res)=>{
    try
    {
        await  mongoose.connect(process.env.MONGO_URL)
        console.log("mongo db is connected");
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:err.message
        })
    }
}



module.exports = connectDB;