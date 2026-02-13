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
paymentroute.post("/payment/webhook", async (req, res) => {
  try {

    const webhookSignature = req.header("X-Razorpay-Signature");

    const isValidWebhook = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValidWebhook) {
      return res.status(400).json({ msg: "Invalid webhook Signature" });
    }

    // ⚠️ razorpay payload key is lowercase `payment`
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id
    });

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    payment.status = paymentDetails.status;
    await payment.save();

    const Users = await user.findOne({
      orderId: paymentDetails.order_id
    });

    if (Users) {
      Users.isPremium = true;
      Users.membershiptype = payment.notes.membershipType;
      await Users.save();
    }

    return res.status(200).json({ msg: "Payment successfully" });

  } catch (err) {
    console.log("Webhook error:", err);
    return res.status(500).json({ msg: "Webhook error" });
  }
});

module.exports=paymentroute;