const Razorpay=require("razorpay");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports=instance;