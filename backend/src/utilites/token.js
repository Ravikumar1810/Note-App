const jwt =  require("jsonwebtoken");
require("dotenv").config();

function genrateaccessToken(user)
{
    return jwt.sign({_id:user._id }, 
        process.env.JWT_TOKEN,
        {expiresIn:'5min'}
    );
}
function genraterefreshToken(user)
{
    return jwt.sign({_id:user._id},
        process.env.REFRESH_TOKEN,
        {expiresIn:'1d'}
    )
}


module.exports = {genrateaccessToken, genraterefreshToken};