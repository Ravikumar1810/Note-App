const User = require("../models/user");
const validator = require("email-validator");
const bcrypt = require("bcrypt");
const { genrateaccessToken, genraterefreshToken } = require("../utilites/token");
const emailverfication = require("../nodemailer/sendEmail");
const OTP = require("../models/otp");
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // vaidation  
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Pease fill all required fields'
            });
        }
        // check the emmail formate  
        if (!validator.validate(email)) {
            return res.status(400).json({
                success: false,
                message: "Please write  correct email formate"
            });
        }
        // check the  user exist or not  
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: 'email already exist .Please  do login'
            });
        }
        // hash the  pass  
        const hashpassword = await bcrypt.hash(password, 10);
        //  create the  user and send the  user 
        const newuser = await User.create({
            username,
            email,
            password: hashpassword
        })
        const genrateOtp = Math.floor(900000 + Math.random() * 100000).toString();
        //  create the otp  
        const otpdoc = await OTP.create({
            userId: newuser._id,
            otp: genrateOtp,
            expiredAt: 5 * 60 * 1000
        });
        await emailverfication(email, genrateOtp);
        //  creating the  user  
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                username: newuser.username,
                email: newuser.email,
                otpdoc
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}


//  verfiy  otp  

const  verifyOtp  =  async (req, res)=>{
    try
    {
        const {email ,  enterotp} = req.body;
        //  need both email  and  otp  
        if(!email ||  !enterotp)
        {
            return res.status(400).json({
                success:false,
                messsage:"Please add both  email and  otp "
            });
        }
        // find the  user exist or not 
        const  user  =  await User.findOne({email});
        if(!user)
        {
            return res.status(404).json({
                success:false,
                message:"user  not found"
            });
        }
        // check the  otp  is correct  not expired  both are okay then  verify otp and delete it  
        const  otpdoc  =  await OTP.findOne({userId:user._id});
        if(!otpdoc)
        {
            return res.status(404).json({
                success:false,
                message:"Otp  not found"
            });
        }
        // check  is it  expired or  not  
        if(enterotp <=  otpdoc.expiredAt && enterotp === otpdoc.otp)
        {
                return res.status(400).json({
                    success:false,
                    message:"otp not matched  or  it expired  please check your  otp"
                });
        }
        //  genrate the access token and refresh token  
        const accessToken  =  genrateaccessToken(user);
        const refreshToken = genraterefreshToken(user);
             user.refreshtoken = refreshToken;
             user.isVerified = true
             await user.save();
        //  if  evrything  is fine then  give the access  
     await OTP.findOneAndDelete({userId:user._id});
      
         // send the refresh token  
res.cookie("refreshtoken", refreshToken,{
    httpOnly:true,
    secure:false,
    maxAge:24*60*60*1000
})
         return res.status(200).json({
            success:true,
            message:"User verified successfully",
            accessToken
         });

    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:'Internal server error',
            error:err.message
        });
    }
}

//  login
const  login   =  async (req, res)=>{
    try
    {
const {email , password} =  req.body;
// required  both  email and  password  
    if(!email ||  !password)
    {
        return res.status(400).json({
            success:false,
            message:"Please add both email and  password"
        });
    }
    //  check the  email formate  
    if(!validator.validate(email))
    {
        return res.status(400).json({
            sucess:false,
            message:"Please check the  email formate"
        });
    }
    //  check the  user exist or not  
    const existinguser = await  User.findOne({email});
    if(!existinguser)
    {
        return res.status(404).json({
            success:false,
            message:"User not  found.Please do registration"
        });
    }
    // before  giving the  access check the  password 
     const  ismatch  = await bcrypt.compare(password ,  existinguser.password);
        if(!ismatch)
        {
            return res.status(401).json({
                success:false,
                message:"password  mismatched"
            });
        }
            // if evrything is  okay then give the access 
        const accessToken  =  genrateaccessToken(existinguser);
        const refreshTokn =  genraterefreshToken(existinguser);
          existinguser.refreshtoken = refreshTokn
          existinguser.isVerified = true
          await existinguser.save();
    
            res.cookie("refreshtoken", refreshTokn, {
                httpOnly:true,
                secure:false,
                maxAge:24 * 60 * 60 * 1000 
            })
          return res.status(200).json({
            success:true,
            message:'logged in successfully',
            accessToken
          });
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:err.message
        });
    }
}



//  verify refresh token and  genrate the acess token  
  

// resend the  otp  

// forget pass  

//  

module.exports = {register ,  login ,verifyOtp}
