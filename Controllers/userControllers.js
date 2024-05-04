const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");


//controller for user registration
exports.registeruserController = async(req,res)=>{
      try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).send({success:false,message:"Please fill all the fields.."});
        }

        if(!emailValidator.validate(email)){
            return res.status(400).send({succes:false,message:"Please enter a valid email address.."});
        }

        const existUser = await userModel.findOne({email});
        if(existUser){
            return res.status(401).send({
                success:false,
                message:"This email is already exists.."
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        //save new user
        const user = new userModel({email,password:hashedPassword});
        await user.save();

        const token = jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});

        res.cookie("jwt",token,{
            withCredentials:true,
            httpOnly:false,
            maxAge:24*60*60*1000,
            secure:true,
            sameSite:"None"
        });

        return res.status(201).send({
            success:true,
            message:"User is created...",
            token:token
            
        });
      }
      catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"error while creating new user",
            error
        })
      }
};

//controller for user login
exports.loginuserController = async(req,res)=>{
      try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});

        if(!email || !password){
            return res.status(401).send({
                success:false,
                message:"Please fill all the fields"
            });
        }
        
        if(!user){
            return res.status(200).send({
                success:false,
                message:"email is not registered"
            })
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).send({
                success:false,
                message:"invalid email and password"
            })
        }

        const token = jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});

        res.cookie("jwt",token,{
            withCredentials:true,
            httpOnly:false,
            maxAge:24*60*60*1000,
            secure:true,
            sameSite:"None"
            
        });

        return res.status(200).send({
            success:true,
            message:"Login successfully...",
            user:user,
            token:token
        });

      }catch(error){
        console.log(error);
         return res.status(500).send({
            success:false,
            message:"error in login",
            error
         })
      }
};

//controller for user logout
exports.logoutuserController = async(req,res)=>{
    try{
        res
        .clearCookie("jwt",{secure:true,sameSite:"None"})
        .status(200)
        .send({success:true,message:"Logout successfully..."});
    }catch(error){
        return res.status(500).send({success:false,message:"Internal server error"});
    }
}