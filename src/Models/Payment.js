const mongoose=require("mongoose")

const {Schema}=mongoose;

const paymentSchema=new Schema({
    useID:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    PaymentId:{
        type:String,
    },
    orderId:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    amount:{
        type:String,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    receipt:{
        type:String,
         required:true
    },
    notes:{
        firstName:{
            type:String,

        },
        lastName:{
            type:String,
        },
        membershipTyp:{
            type:String
        }
    }


})
module.exports=mongoose.model("payment",paymentSchema)