const jwt = require("jsonwebtoken");

//middleware function to verify jwt token
exports.verifyToken =(req,res,next)=>{
    try{ 
        const token = req.headers['authorization'].split(" ")[1];
    if(!token){
        return res.send({success:false,message:"token is not provided"});
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.send({success:false,message:"Failed to authenticate token"});
        }
        req.userId = decoded.userId;
        next();
    });

    }catch(error){
        console.log(error.data);
    }
    
}