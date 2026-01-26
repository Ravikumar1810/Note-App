const  express =  require("express");
const router  =  express.Router();
const {register,  login, verifyOtp}  = require("../controllers/auth");
const  verifyuser =  require("../middlewares/verifyRoutes");


router.post('/register', register);
router.post('/login',  login);
router.post('/verify-otp', verifyOtp);

router.get('/home', verifyuser , (req, res)=>{
    res.send("welcome to  home");
})

module.exports=router;