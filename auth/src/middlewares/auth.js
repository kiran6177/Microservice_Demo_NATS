const { verifyToken } = require("../utils/jwt");

const isLogin = (req,res,next)=>{
    try {
        if(req.headers && req.headers['authorization']){
            const token = req.headers['authorization'].split(' ')[1]
            const isValid = verifyToken(token);
            if(isValid){
                req.user = isValid
                next()
            }else{
                return res.send({currentUser:null})
            }
        }else{
            return res.send({currentUser:null})
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {isLogin}