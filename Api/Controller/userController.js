const asyncHandler=require("express-async-handler")
const bcrypt =require("bcryptjs");
const jwt=require('jsonwebtoken');
const { createUserTable } = require("../Model/userModel");
// // const getUser=asyncHandler(async(req, res)=>{
// //   if (!req.user.isAdmin){
// //     req.status(403);
// //     throw new Error('Admin acess required')
// //   }
// // const users=await User.find().select("password")
// // res.json(users)
// // })
// const registerUser=asyncHandler(async(req, res)=>{
//   const {fname,lname, email, password}=req.body
//   if(!fname|| !lname||!email||!password){
//     res.status(400)
//     throw new Error("please fill all details")
//   }
//   const userExist=await createUserTable.findOne({email:email});
// if(userExist){
//   res.status(401);
//   throw new Error('user already exist');
// }  

// const salt=await bcrypt.genSalt(10)
// const hashedPassword=await bcrypt.hash(password, salt)
//   const user=await User.create({
//     name, email, 
//     password:hashedPassword,
//   });
//   if(!user){
//     res.status(400);
//     throw new Error(" invalid data");
//   }
//   res.status(201).json({
//     _id: user._id,
//     fname:user.fname,
//     lname:user.lname,
//     email: user.email,
//     token:generateToken(user._id),
//   });
//   });
//    const loginUser=asyncHandler(async(req, res)=>{
    
//     const {email, password}=req.body
//     if(!email || !password){
//       res.status(400)
//       throw new Error('please fill all the details')
//     }
//     const user=await createUserTable.findOne({email: email})
//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.status(200).json({
//         _id: user._id,
//         fname: user.fname,
//         lname: user.lname,
//         email: user.email,
//         token:generateToken(user._id),
       
//       });
//     }  else{
//         res.status(401)
//     throw new Error("invalid credential");
//       }
//     });
//     const secureControl=asyncHandler(async(req, res)=>{
//       const user=await createUserTable.findById(req.user.id)
//       if(!user){
//         res.status(401)
//         throw new Error("user not found")
//       }
      
      
//     });
//     const generateToken=(id)=>{
// return jwt.sign({id}, process.env.JWT_SECRET, {
//   expiresIn:"30d"
// })
//     }  ;
    
 
// module.exports={registerUser, loginUser, secureControl};
const registerUser = async (pool, userData) => {
  try {
      const { fname, lname, email, password } = userData;
     
      const [existingUsers] = await pool.query(
          `SELECT * FROM users WHERE email = ?`,
          [email]
      );
      if (existingUsers.length > 0) {
          throw new Error('User already exists');
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
     
      await connection.execute(
          `INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)`,
          [fname, lname, email, hashedPassword]
      );
      console.log('User registered successfully');
  } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Error registering user');
  }
};


const loginUser = async (pool, email, password) => {

  try {
     
      const [users] = await pool.query(
          `SELECT * FROM users WHERE email = ?`,
          [email]
      );
      connection.release();
      if (users.length === 0) {
          throw new Error('User not found');
      }
      const user = users[0];
     
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          throw new Error('Invalid credentials');
      }
     
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '30d'
      });
      return { token, user: { id: user.id, fname: user.fname, lname: user.lname, email: user.email } };
  } catch (error) {
      console.error('Error logging in user:', error);
      throw new Error('Error logging in user');
  }
};

module.exports = {  registerUser, loginUser };