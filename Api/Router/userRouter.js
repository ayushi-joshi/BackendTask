


const express=require('express')
const { registerUser, loginUser }=require("../Controller/userController");
const { protect } = require('../Middleware/authMiddleware');
const router=express.Router();
router.post("/", registerUser);
router.post("/login", loginUser);


module.exports=router;
