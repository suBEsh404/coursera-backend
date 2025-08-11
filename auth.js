const jwt = require('jsonwebtoken')
USER_JWT_SECRET = process.env.USER_JWT_SECRET
ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET
async function userAuth(req,res,next){
    const token = req.headers.token
    const verifiedId = jwt.verify(token,USER_JWT_SECRET)
    if(verifiedId){
        req.id = verifiedId.id
        next();
    }else{
        res.status(403).json({
            message : "invalid token"
        })
    }
}

function adminAuth(req,res,next){
    const token = req.headers.token
    const verifiedId = jwt.verify(token,ADMIN_JWT_SECRET)
    if(verifiedId){
        req.id = verifiedId.id
        next();
    }else{
        res.status(403).json({
            message : "invalid token"
        })
    }    
}

module.exports = {
    userAuth,
    adminAuth
}