const jwt = require('jsonwebtoken');
const asyncHandler=require('express-async-handler');
const User=require("../Model/userModel");
const protect=asyncHandler(async(req, res ,next)=>{
    let token;
    if(
        req.headers.authorization && req. headers.authorization.startsWith("Bearer")
    ){
        try {
         
           token=req.headers.authorization.split(" ")[1]; 
       
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
      
       req.user=await User.findById(decoded.id).select("-password");
       if (!req.user) {
        throw new Error("User not found");
    }
       next();
        } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("unauthrized access");
        }

    }else{
        res.status(401);
        throw new Error("unauthrized access");
    }
});
module.exports={protect};