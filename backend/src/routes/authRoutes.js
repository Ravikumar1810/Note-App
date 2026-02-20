const  express =  require("express");
const router  =  express.Router();
const {register ,  login ,verifyOtp, resendsignupotp, verifyToken, forgetPass, resetpass ,  resendResetotp } = require("../controllers/auth")
const  verifyuser =  require("../middlewares/verifyRoutes");


router.post('/register', register);
router.post('/login',  login);
router.post('/verify-otp', verifyOtp);
router.post('/forgetpassword' ,forgetPass)
router.post('/resendsignupotp' , resendsignupotp)
router.post('/resetpass' , resetpass)
router.post('/resendResetotp' , resendResetotp)
router.post('/verifyToken', verifyToken)

router.get('/home', verifyuser , (req, res)=>{
    res.send("welcome to  home");
})

module.exports=router;