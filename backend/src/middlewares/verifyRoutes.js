const User    =  require("../models/user");
const jwt =  require("jsonwebtoken");
//  here i need to write the  route which is  take  and token check weather  user  verifyed or  not  

const verifyuser = async (req,  res , next)=>{
    try
    {
     const headertoken =  req.headers.authorization;
        if(!headertoken && !headertoken.startsWith("Bearer "))
        {
            return res.status(401).json({
                success:false,
                message:"Unathorized user. token  not  found"
            });
        }

    const token  =  headertoken.split(" ")[0];
    // token  verification  
    const  verifytoken  =  jwt.verify(token , process.env.JWT_TOKEN);
        if(!verifytoken)
        {
            return res.status(404).json({
                success:false,
                message:"token  not  matched "
            });
        }
        next();
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