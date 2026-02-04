const jwt = require('jsonwebtoken');
const User = require('../Models/user');
  
const adminAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
   
 
    try {
        if(!token){
            throw new Error("Unauthorized access. Please log in.");
        }

        const decoded = jwt.verify(token,'vinod@12345');
       

        const user=await User.findById(decoded._id);
       
        if (!user) {
            throw new Error("User not found.");
        }
       
        req.user = user;
       
        next();
    
    }
    catch (err) {
        res.status(401).send("Error: " + err.message);
    }

};
module.exports = {adminAuth}