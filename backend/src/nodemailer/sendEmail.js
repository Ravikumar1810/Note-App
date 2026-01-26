//  here  i need to send the email  
const nodemailer  =  require("nodemailer");
require("dotenv").config()
const  emailverfication   = async (email , otp)=>{
    const transporter =  nodemailer.createTransport({
        service:'gmail.com',
        port:587,
        secure:false,
        auth:{
            user:process.env.APP_USER,
            pass:process.env.APP_PASSWORD
        }
    });

      await transporter.verify();
      console.log("email  verified successfully");

     const  emailinfo ={
         from :`NotesApp : ${process.env.APP_USER}`,
         to:email,        
        subject: "Your OTP Verification Code",
        text: `Your One-Time Password  is: ${otp}. It expires in 10 minutes.`,
     }
     try
     {
          await  transporter.sendMail(emailinfo)
            console.log("the email sent....");
            
     }catch(err)
     {
        return res.status(500).json({
            sucess:false,
            message:'Internal server error',
            error:err.message
        });
     }
   
} 

module.exports = emailverfication




