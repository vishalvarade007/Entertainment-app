const jwt = require("jsonwebtoken");

//middleware function to verify jwt token
exports.verifyToken =(req,res,next)=>{
    const token = req.cookies.jwt;
    if(!token){
        return res.send({succes:false,message:"token is not provided"});
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.send({success:false,message:"Failed to authenticate token"});
        }
        req.userId = decoded.userId;
        next();
    });
}