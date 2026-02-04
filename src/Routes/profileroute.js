const express=require('express');
const user=require('../Models/user');
const {adminAuth}=require('../middleware/auth');
const profileRouter=express.Router();
const bcrypt=require('bcrypt');


profileRouter.get('/profile/view',adminAuth,async(req,res)=>{
    try{
        const userProfile=await user.findById(req.user._id);
       res.send(userProfile);
      
    }catch(err){
        res.status(500).send("Error fetching profile"+err.message);
    }

})
profileRouter.patch('/profile/update',adminAuth,async(req,res)=>{
    try{
        const updates=Object.keys(req.body);
        const allowedUpdates=['firstName','lastName','age','about','gender','skills','photourl'];
        const isValidOperation=updates.every((update)=>allowedUpdates.includes(update));
        if(!isValidOperation){
            throw new Error("Invalid updates!");
        }
        const userProfile=await user.findById(req.user._id);
        updates.forEach((update)=>userProfile[update]=req.body[update]);
        await userProfile.save();
        res.json(userProfile);
        }catch(err){
            res.status(400).send("Error updating profile"+ err.message)
        }
})

profileRouter.patch('/profile/change-password',adminAuth,async(req,res)=>{
    try{
        const {oldPassword,newPassword}=req.body;
        const userProfile=await user.findById(req.user._id);
        const isPasswordMatch= await userProfile.validatePassword(oldPassword)
        if(!isPasswordMatch){
            throw new Error("old password is incorrect.");
        }
        if(newPassword===oldPassword){
            throw new Error("New password must be different from old password.")
        }
         const passwordHash=await bcrypt.hash(newPassword,10);
        userProfile.password=passwordHash;
        await userProfile.save();
        res.send("Password changed successfully");
    }catch(err){
            res.status(500).send("Error chaninging Password"+err.message)
    }
})
module.exports=profileRouter;