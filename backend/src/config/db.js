const  mongoose =  require("mongoose");
require("dotenv").config();

const connectDB = async(req, res)=>{
    try
    {
        await  mongoose.connect(process.env.MONGO_URL)
        
        console.log("mongo db is connected");
    }catch(err)
    {
       console.error(err);
    }
}



module.exports = connectDB;