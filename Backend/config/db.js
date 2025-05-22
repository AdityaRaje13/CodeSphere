// import mongoose
const mongoose = require("mongoose");


// connect with the mongoose 
const connection = mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("Connected to mongoDB successfully");
})
.catch((err) => {
    console.log(err);
})


module.exports = connection;