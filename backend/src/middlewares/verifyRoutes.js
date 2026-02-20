const User    =  require("../models/user");
const jwt =  require("jsonwebtoken");


const verifyuser = async (req,  res , next)=>{
    try
    {
      const header =  req.headers.authorization;
      
        if(!header ||!header.startsWith("Bearer "))
        {
            return res.status(403).json({
                success:false,
                message: "forbidden  access  Please  login || unathorized user    "
            });
        }

        const token  =  header.split(" ")[1];
         const decode = jwt.verify(token, process.env.JWT_TOKEN);
         if(!decode){
            return res.status(401).json({
                success:false,
                message:"failed to verify the token"
            });
         }
          
  const user  =  await User.findById(decode._id)

  if(!user){
    return res.status(404).json({
        success:false,
        message:"User not found "
    });
  }
  
  req.user = user;
  next ();
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:err.message
        });
    }
}  

module.exports = verifyuser;