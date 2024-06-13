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
                let error = new Error();
                error.type = "Unauthorized";
                error.statusCode = 403;
                error.reasons = [{message:'Unauthorized'}]
                throw error;
            }
        }else{
            let error = new Error();
            error.type = "Unauthorized";
            error.statusCode = 403;
            error.reasons = [{message:'Unauthorized'}]
            throw error;
        }
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}

module.exports = {isLogin}