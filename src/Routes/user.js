const express=require('express');
const connectionRequest = require('../Models/conectionreques');
const {adminAuth}=require('../middleware/auth')
const User=require('../Models/user');

const userRouter=express.Router(); //create user router using express router

userRouter.get('/user/requests/received',adminAuth,async(req,res)=>{  //get  the user receive requests
    try{
        const logInuser=req.user; // login user
        const receivedRequests=await connectionRequest.find({touserId:logInuser._id,
            status:"Interested"}).populate('fromuserId'," firstName lastName photourl about skills"); //find all connection requests where the logged in user is the receiver and status is Interested in array of objects
        res.json({message:"Received requests fetched successfully",data:receivedRequests}); //send success response with received requests data
    }catch(err){
        res.status(500).send("Error fetching received requests: "+err.message); //500 internal server error
    }
})
userRouter.get('/user/connections',adminAuth,async(req,res)=>{ //get all connections of logged in user
    try{
        const logInuser=req.user; //logged in user
        const connections=await connectionRequest.find({$or:[
            {fromuserId:logInuser._id,status:"Accepted"},
            {touserId:logInuser._id,status:"Accepted"}
        ]}).populate('fromuserId touserId'," firstName age gender lastName photourl about skills"); //find all connection requests where the logged in user is either sender or receiver and status is Accepted in array of objects

        const data=connections.map((connections)=>{
        if(connections.fromuserId._id.equals(logInuser._id)){
            return connections.touserId;
        }
        return connections.fromuserId;
        }); 
        res.json({message:"Connections fetched successfully" ,data}); //send success response with connections data
    }catch(err){
        res.status(500).send("Error fetching connections: "+err.message); //500 internal server error
    }

})
userRouter.get('/user/feeds',adminAuth,async(req,res)=>{ //get user feeds
    try{

        const logInuser=req.user; //logged in user
        const page=parseInt(req.query.page) || 1; //get page number from query params, default to 1
        const limit=parseInt(req.query.limit) || 10; //get limit from query params, default to 10
        const skip=(page-1)*limit; //calculate number of documents to skip
        const connections=await connectionRequest.find({$or:[
            {fromuserId:logInuser._id},
            {touserId:logInuser._id}
        ]}) //find all connection requests where the logged in user is either sender or receiver in array of objects
        const ignoreuserIds=new Set(); //set to store user ids to be ignored in feeds
        connections.forEach((connection)=>{
            ignoreuserIds.add(connection.fromuserId); //add fromuserId to ignore set
            ignoreuserIds.add(connection.touserId); //add touserId to ignore set
        });
        const feeds=await User.find({$and:[
           { _id:{$nin:Array.from(ignoreuserIds)}}, //exclude users in ignore set
          { _id:{$ne:logInuser._id}}  //exclude logged in user
        ] }).select("firstName lastName photourl about age gender skills").skip(skip).limit(limit); //select only necessary fields and apply pagination
        res.json({message:"Feeds fetched successfully",data:feeds}); 
    }catch(err){
        res.status(500).send("Error fetching feeds: "+err.message); //500 internal server error
    }
})

module.exports=userRouter;