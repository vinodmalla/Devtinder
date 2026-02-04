const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://mallavinod95:EiYHD4veKOL6spCs@cluster0.xsxdx3s.mongodb.net/Divtinder");
}
module.exports = connectDB;
