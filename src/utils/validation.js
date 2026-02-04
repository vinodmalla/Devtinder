const validator=require('validator');

const validateUserData=(req)=>{
    const {firstName,lastName,email,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("First name and last name are required.");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Invalid email address.");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password must be strong")

    }
};
module.exports={validateUserData};