const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {Schema}=mongoose;
const userSchema=new Schema({
    firstName:{type:String,
        required:true,
        minlength:3,
        maxlength:30
    },
    lastName:{type:String,
        required:true,
        minlength:3,
        maxlength:30
    },
    email:{type:String,required:true,unique:true,
        trim:true,
        lowercase:true,
        validate:{
            validator:function(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email address");
                }
            }
        }
    },
    password:{type:String,
        required:true,
       


    },
    age:{type:Number,
        min:18,
        max:70
    },
    gender:{type:String,
        
        validate:{
            validator:function(v){
                if(!["male","female","other"].includes(v.toLowerCase())){
                    throw new Error("Gender must be 'male', 'female', or 'other'.");
                }
            }
        }
    },
    photourl:{type:String,
        default:"https://www.example.com/default-photo.jpg",
    },
    about:{type:String,default:"Attitude is everyghing."},
    
    skills:{
        type:[String],
    }
},{timestamps:true});
userSchema.methods.generateAuthToken=function(){
    const user=this;
    const token=jwt.sign({_id:user._id},"vinod@12345",{expiresIn:'7d'});
    return token;
}
userSchema.methods.validatePassword=async function(passwordbyuser){
    const user=this;
    const passwordHash=user.password;
    const passwordvalid=await bcrypt.compare(passwordbyuser,passwordHash)
    return passwordvalid;
}

module.exports=mongoose.model('User',userSchema);