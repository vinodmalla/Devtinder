const express=require('express');
const user=require('../Models/user');
const {adminAuth}=require('../middleware/auth');
const connectionRequest = require('../Models/conectionreques');

const requestRoter=express.Router();
requestRoter.post('/request/:status/:userId',adminAuth,async(req,res)=>{
    try{
        const fromuserId=req.user._id;
        const touserId=req.params.userId;
        const status=req.params.status;
        const allowedStatuses=['Ignored','Interested'];
        if(!allowedStatuses.includes(status)){
            throw new Error("Invalid status");
        }
        const connectionRequestExist=await connectionRequest.findOne({$or:[
            {fromuserId,touserId},
            {fromuserId:touserId,touserId:fromuserId}
        ]});
        if(connectionRequestExist){
            throw new Error("Connection request already exits.")
        }
        const existingUser=await user.findOne({_id:touserId})
        if(!existingUser){
            throw new Error("User not found.")
        }
        const newConnectionRequest=new connectionRequest({
            fromuserId,
            touserId,
            status
        });
        await newConnectionRequest.save();
        res.send(`${req.user.firstName} Connection request ${status} successfully.`)

    }
    catch(err){

        res.status(500).send("Error handling connection request: "+err.message);
    }
})
requestRoter.post('/request/review/:status/:requestId',adminAuth,async(req,res)=>{
    // Review connection request for accepting or rejecting
    try{
        const logInuser=req.user; // The user who is logged in
        const {status,requestId}=req.params; //status can be Accepted or Rejected whatever user choose
        const allowedStatuses=['Accepted','Rejected']; //only these two status are allowed for review 
        if(!allowedStatuses.includes(status)){
            return res.status(400).send("Invalid status"); //400 bad request
        }
        const connection=await connectionRequest.findOne({_id:requestId,touserId:logInuser._id,status:"Interested"}); //find the connection request with given id where the logged in user is the receiver and status is Interested
        if(!connection){
            return res.status(404).send("Connection request not found.") //404 not found
        }
        connection.status=status; //update the status to Accepted or Rejected
        await connection.save(); //save the updated connection request
        res.json({message:`Connection request ${status} successfully.`,data:connection}) //send success response with updated connection request data
    }catch(err){
        res.status(500).send("Error reviewing connectin request:" +err.message); //500 internal server error
    }

})
module.exports=requestRoter;