const express=require("express");
const {adminAuth}=require("../middleware/auth");
const paymentroute=express.Router();
const instance=require("../utils/razorpay")
const Payment=require("../Models/Payment")
const memberShipAmount=require("../utils/constants")
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const user=require("../Models/user");

paymentroute.post("/create/order",adminAuth,async(req,res)=>{
    const {membershipType}=req.body;
    const {firstName,lastName,email}=req.user
    try{
        const order=await instance.orders.create({
            "amount": memberShipAmount[membershipType]*100,
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                 firstName,
                 lastName,
                 email,
                 membershipType:membershipType,
             }

        })
        const payments=new Payment({
            useID:req.user._id,
            orderId:order.id,
            status:order.status,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes

        })
        const savedpayments=await payments.save()
        res.send({...savedpayments.toJSON()})
    }catch(err){
        res.send(err)

    }
})
paymentroute.post("/payment/webhook",async(req,res)=>{
    try{
        const webhookSignature=req.header("X-Razorpay-Signature")
    const isValidwebhook=validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)
    if(!isValidwebhook){
        return res.status(400).json({msg:"Invalid webhook Signature"})

    }
    const paymentDetails=res.body.payload.Payment.entity;
    Payment.status=paymentDetails.status;
    await Payment.save();
    const Users=await user.findOne({orderId:paymentDetails.order_id});
    Users.isPremium=true;
    Users.membershiptype=Payment.notes. membershipType;
    await user.save();
    return res.send(200).json({msg:"Payment successfully"})


    }
    catch(err){
        console.log(err)
    }
})
module.exports=paymentroute;