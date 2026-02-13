require("dotenv").config();
const express = require('express');
require("./utils/Cronjob")

const connectDB = require('./config/database');
const user=require('./Models/user');
const authRouter=require('./Routes/authroute');
const profileRouter=require('./Routes/profileroute');
const requestRoter=require('./Routes/requestroute');
const cookieParser = require('cookie-parser');
const userRouter=require('./Routes/user');
const app = express();
const cros=require('cors');
const paymentroute=require("./Routes/paymentroute")
app.use(cros(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));
app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRoter);
app.use("/",userRouter);
app.use("/",paymentroute);




connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
    console.log("Server is running on port 7777");
});
}).catch((err) => {
    console.error("Database connection failed", err);
});




