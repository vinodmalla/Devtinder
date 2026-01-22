const express = require('express');
const app = express();
app.use("/home", (req, res)=> {
    res.send("Welcome to the Home Page!");
});
app.use("/about", (req, res)=> {
    res.send("Welcome to the About Page!");
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
