const mongoose= require('mongoose');

const connectionReuestSchema=new mongoose.Schema({
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"

    },
    touserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:['Ignored','Accepted','Interested','Rejected'],
        required:true
    }
},{timestamps:true});


connectionReuestSchema.index({fromuserId:1,touserId:1});
connectionReuestSchema.pre('save',async function () {
    const connectionRequest = this;

    if (connectionRequest.fromuserId.equals(connectionRequest.touserId)) {
      throw new Error("Cannot send connection request to yourself.")
    }

});


const connectionRequest=mongoose.model("connectionRequest",connectionReuestSchema);
module.exports=connectionRequest;