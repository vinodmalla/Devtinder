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
        default:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAdVBMVEX///8AAABgYGD8/Pzk5OQkJCQEBAT5+fkICAj29vYnJye9vb3s7Ow1NTXp6enPz8+FhYXV1dVbW1stLS2Tk5M7OzvKysqBgYHDw8OioqJNTU13d3eLi4uWlpYTExNqamqwsLCrq6vd3d1FRUVUVFQdHR1vb288+g1dAAAEv0lEQVR4nO3cCXeiPBQG4IQgiLjhUpdqxW7//yd+WdDRjoOEipfL9z5z2jlTx9O8vSGEECoEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD/jlL2Q7l/FH+bLxl0zXoYJVwMlYTp4jWYzWbB6yIdJ+YVEZ9eZczUT+eI091cXprv1ra03PMJG1GEexsviiKbzn2Wo03YhYzmANy8XZXvlFDK3kaw7qW67bp/ivRHviu9tR17mKY0HTBOdhc1+0tfyoU5SvUfjkzC4dIcfv+uoX5pOxRsaxiLbOkKVRrx411wraEIRzpBSQWlG1+XY+qm+nOjRzi4E+9UxtGQ3WhjDkGVBGWDzFVHPcSKY8RdhXSniAvBbf6mG/tSNP5+QDPYZvbcyYgSyae8O8ycSxjJIOY1f9Nt3VTto4Wcus1+dAlHngmX3E6JR8+A7IoYb70TBqyOQxF6B5SS18xmUe1E8Yf+3xvqRnuZ+SbUDtSN9hH6jqTGckjdbA8T/xJG8i2jbraHtE5CuaZutoe9ZzznSN1sD9NaCRfUzfbwWivhlLrZHr47n7BeDXfUzfZQ+fL+CqdJzVHWmNPInLrZHta1avhC3WwP2VeNgIN36mZ7MIv53j4S6mb78B9MI7mibrSXvEYNOU1LdTf1D/jGqpMqsfJOuGO1rK/circXTleHdhdJYFfrK532I3MT9ZvXfVKlRFZ1UV+6u8S8Smh3YKxkv3IN+3LH67aFvd+ZfHnMTUcxv30nqvJijemja263D52ja33ZXozih5BTN7Uepab3qlgcqJwufS/pjvcqyzO61zitXlxLRLyQ9zPuuW1SuKDurZya7BuWY8yF7KOIEv2MZm05XfbepOJk93Z7eqO/8rVPmBdQz1D1FDVcXZfuHHY6ZrcX6m+u/eP9Nvox5vS3+2EXtghbJkSSLS5v7X/uM7uXXXHbgXHHcJLmxzydcLoVWlcn+uYt6vy5mxHPw0o3hpdSXUio/GKwi1zvHMCp854TVm2zKorOKKOIk3FY3ThhdOo3ZXjZrILtaD7oVTOYj7aH6WYiWlxEVZwK9Md77r/z8jyZy8PicGzdypQqIqpJMKidz5gfsrY+B2XHivTTtNL/Dn7BvXG2NkNV+y6rdHsmM+mecqob0bzPrD0ezBJ/y3rpaXe+XR4tXyAtT1i899imflrMNscfNWPdth27KrYhqLuMfenVP/xuiOQ8s/Ha0FVtCfNfjC839WU/Fy0ZbszD6HU2JpQzP6+0HSU0NXx4Bd3yYz9txYB6ekqtERn1dNx99+HvZjH/FslRImgPRvswrAoe3kX/RDwo2odL7XdfNBTvfN+GspuagOPHjzJXGYnXVnXEQ2PxnFfqM0Zz4+hJRhpRic/GEx5oj8NJ4wFl/530fLhrcJg52dMFFCJpciB1IvlFufF0/YyEckKYsN6zMb4IN4Anj72uv8n8jh6SbmrHt1qPVfgjfBAjfUpAyl38zU26r9E98nWovtH5V+iGmicMNNaMLGG13wP1e0uyhM/JF8keWcLS38T2wISDjieUnU/Y/RpSJpTNX1pYHR9pIsqEzwho0CUMZsEzzL7JEgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQA3/ATIJNhm+rhgCAAAAAElFTkSuQmCC",
    },
    about:{type:String,default:"Attitude is everyghing."},
    
    skills:{
        type:[String],
    },
    isPremium:{
        type:String,
    },
    membershiptype:{
        type:String
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