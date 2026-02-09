const express=require('express');
const authRouter=express.Router();
const user=require('../Models/user');
const {validateUserData}=require('../utils/validation');
const validator=require('validator');
const bcrypt=require('bcrypt');
const SendEmail=require('../utils/SendEmail')

authRouter.post('/signup',async(req,res)=>{
   
    try{
        validateUserData(req);
        const userData=new user(req.body);
        const passwordHash=await bcrypt.hash(userData.password,10);
        userData.password=passwordHash;
        const saveduser= await userData.save();
        const token=await saveduser.generateAuthToken();
        res.cookie("jwt",token,{expires:new Date(Date.now()+60000 * 60 * 24 * 7)});
    res.json({message:"user data successfully created",data:saveduser})
    }catch(err){
        res.status(500).send("Error signing up user"+err.message);
    }
    
});
authRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    
    try{
        if(!validator.isEmail(email)){
            throw new Error("Invalid email address.");
        }
        const existingUser=await user.findOne({email});
        const token=await existingUser.generateAuthToken();
        res.cookie("jwt",token,{expires:new Date(Date.now()+60000 * 60 * 24 * 7)});
        if(!existingUser){
            throw new Error("Invalid email address.");
        }
        const isPasswordMatch=await existingUser.validatePassword(password)
        if(!isPasswordMatch){
            throw new Error("Invalid password.");
        }
        else{
            const emailres=await SendEmail.run();
            console.log(emailres);
            res.json(existingUser);

        }
    }catch(err){
        res.status(500).send("Error logging in user"+err.message);
    }
});
authRouter.post('/logout',async(req,res)=>{
   
  res.cookie("token","",{ expires: new Date(0)});
  return res.status(200).json({ message: "Logged out successfully" });
});



module.exports=authRouter;