const User = require("../models/user");
const validator = require("email-validator");
const bcrypt = require("bcrypt");
const { genrateaccessToken, genraterefreshToken } = require("../utilites/token");
const emailverfication = require("../nodemailer/sendEmail");
require("dotenv").config();
const jwt  =require("jsonwebtoken");
const OTP = require("../models/otp");


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Pease fill all required fields'
            });
        }

        if (!validator.validate(email)) {
            return res.status(400).json({
                success: false,
                message: "Please write  correct email formate"
            });
        }
     
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: 'email already exist .Please  do login'
            });
        }
    
        const hashpassword = await bcrypt.hash(password, 10);
        const newuser = await User.create({
            username,
            email,
            password: hashpassword
        })
         await OTP.deleteMany({ userId: newuser._id });
        const genrateOtp = Math.floor(100000 + Math.random() * 900000).toString(); 
         await OTP.create({
            userId: newuser._id,
            otp: genrateOtp,
            expiredAt: new Date(Date.now() + 5 * 60 * 1000),
            purpose:'signup'
        });
        await emailverfication(email, genrateOtp);
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                username: newuser.username,
                email: newuser.email
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



const verifyOtp = async (req, res) => {
  try {
    const { email, enterotp } = req.body;

    if (!email || !enterotp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpdoc = await OTP.findOne({ userId: user._id });
    if (!otpdoc) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (otpdoc.otp.toString() !== enterotp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpdoc.expiredAt < new Date()) {
      await OTP.deleteOne({ _id: otpdoc._id });
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    //  SIGNUP FLOW
    if (otpdoc.purpose === "signup") {
      user.isVerified = true;

      const accessToken = genrateaccessToken(user);
      const refreshToken = genraterefreshToken(user);

      user.refreshtoken = refreshToken;
      await user.save();

      await OTP.deleteOne({ _id: otpdoc._id });

      // const isProd = process.env.NODE_ENV === "production";

        res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000, //1 Day
      });

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        accessToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    }

    //  RESET PASSWORD FLOW (THIS WAS BUGGY BEFORE)
    if (otpdoc.purpose === "reset") {
      await OTP.deleteOne({ _id: otpdoc._id });

      const resetToken = jwt.sign(
        { userId: user._id, purpose: "reset" },
        process.env.RESET_PASS,
        { expiresIn: "10m" }
      );

      return res.status(200).json({
        success: true,
        message: "OTP verified for password reset",
        resetToken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
      });
    }

  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const  login   =  async (req, res)=>{
    try
    {
    const {email , password} =  req.body;

    if(!email ||  !password)
    {
        return res.status(400).json({
            success:false,
            message:"Please add both email and  password"
        });
    }

    if(!validator.validate(email))
    {
        return res.status(400).json({
            success:false,
            message:"Invalid email format"
        });
    }
 
    const existinguser = await  User.findOne({email});
    if(!existinguser)
    {
        return res.status(404).json({
            success:false,
            message:"User not found. Please register."
        });
    }

    if(!existinguser.isVerified)
    {
        return res.status(403).json({
            success:false,
            message:"Please verify your email before login"
        });
    }
     const  ismatch  = await bcrypt.compare(password ,  existinguser.password);
        if(!ismatch)
        {
            return res.status(401).json({
                success:false,
                message:"password  mismatched"
            });
        }
        const accessToken  =  genrateaccessToken(existinguser);
        const refreshToken =  genraterefreshToken(existinguser);
          existinguser.refreshtoken = refreshToken
          await existinguser.save();
    
            res.cookie("refreshtoken", refreshToken, {
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                path:"/",
                maxAge:24 * 60 * 60 * 1000 
            })
          return res.status(200).json({
            success:true,
            message:'logged in successfully',
            accessToken,
            user:{
                id:existinguser._id,
                username:existinguser.username,
                email:existinguser.email
            }
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




// resend the otp 
const resendsignupotp = async (req, res)=>{

    try{
    const {email}  =  req.body;
    if(!email || !validator.validate(email)){
        return res.status(400).json({
            success:false,
            message:"Please check the email || Please check the email formate "
        });
    }


  const existuser =  await User.findOne({email})

  if(!existuser){
    return res.status(400).json({
        success:false,
        message:"user not found "
    })
  }



   if(existuser.isVerified){
    return res.status(400).json({
        success:false,
        message:"User already verified. Please login"
    })
   }

const otpdoc = await OTP.findOne({ userId: existuser._id });
  
  if(otpdoc){
     const now = Date.now();
      const lastSent = otpdoc.createdAt.getTime();
      const diffInSeconds = (now - lastSent) / 1000;
    if(diffInSeconds <= 60){
       return res.status(429).json({
           success:false,
           message:"Please wait 60 min to send the new request "
       });
    }

      await OTP.deleteOne({ userId: existuser._id });
  }


const  genrateOtp = Math.floor(900000 + Math.random() * 100000).toString();


await OTP.create({
    userId:existuser._id,
    otp:genrateOtp,
    expiredAt: new Date( Date.now() + 5 * 60* 1000),
    purpose:"signup"
});

  await emailverfication(email, genrateOtp);


return res.status(200).json({
    success:true,
    message:"resend  otp send  successfully",
    user: {
        id: existuser._id,
        username: existuser.username,
        email: existuser.email,
      },
});
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error " ,
            error:err.message
        });
    }
}



  
const  verifyToken = async (req , res)=>{
    try
    {
        const headertoken = req.cookies?.refreshtoken;
        
  
        if(!headertoken){
            return res.status(401).json({
                success:false,
                message:"Token not found|| Please login "
            });
        }

        const decode  = jwt.verify(headertoken , process.env.REFRESH_TOKEN);
     
         const user =  await User.findById(decode._id);
            if (!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            }); 
}
 
    if(user.refreshtoken !== headertoken){
        return res.status(401).json({
            success:false,
            message:"Refresh token mismatch. Please login again. "
        })
    }
 const accessToken  = genrateaccessToken(user);
    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      }
    });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:err.message
        });
    }
}


// forget pass

const  forgetPass  =  async (req, res)=>{

    try{
        const {email } = req.body;

        if(!email )
        {
            return res.status(400).json({
                success:false,
                message:" please write email"
            });
        }
    
        const existuser = await User.findOne({email});
        console.log("the user : " ,  existuser)
        if(!existuser)
        {
            return res.status(404).json({
                success:false,
                message:"user not found"
            });
        }

     
         await OTP.deleteMany({userId:existuser._id})

     const  genrateOtp = Math.floor(100000 + Math.random()*900000).toString();


        await  OTP.create({
            userId:existuser._id,
            otp:genrateOtp,
             expiredAt: new Date(Date.now() + 5 * 60 * 1000),
             purpose:'reset'
        })
         await emailverfication(email , genrateOtp)
         return res.status(200).json({
            success:true,
            message:"forget  password  otp send  successfully",
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



const resetpass = async (req, res) => {
  try {
    const { resetToken, newpassword, confirmpassword } = req.body;

    if (!resetToken || !newpassword || !confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and both passwords are required"
      });
    }

    if (newpassword !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const decoded = jwt.verify(resetToken, process.env.RESET_PASS);

    if (decoded.purpose !== "reset") {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token"
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const hashed = await bcrypt.hash(newpassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired reset token",
      error: err.message
    });
  }
};




const resendResetotp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.validate(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otpdocument = await OTP.findOne({ 
      userId: user._id, 
      purpose: "reset" 
    });


    if (otpdocument) {
      const now = Date.now();
      const lastSent = otpdocument.createdAt.getTime();
      const diffInSeconds = (now - lastSent) / 1000;

      if (diffInSeconds < 60) {
        return res.status(429).json({
          success: false,
          message: "Please wait before requesting a new reset OTP"
        });
      }

      await OTP.deleteOne({ userId: user._id, purpose: "reset" });
    }

    const genrateotp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({
      userId: user._id,
      otp: genrateotp,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      purpose: "reset"
    });

    await emailverfication(email, genrateotp);

    return res.status(200).json({
      success: true,
      message: "Reset OTP sent successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};


module.exports = {register ,  login ,verifyOtp, resendsignupotp, verifyToken, forgetPass, resetpass ,  resendResetotp }
