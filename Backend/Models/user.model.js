const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        minLength: [3, "Minimum length of username must be 3 characters"],
        maxLength: [30, "Length must be smaller than 50 characters"],
    },

    email : {
        type : String,
        required: true,
        unique: true,
        minLength: [6, "Minimum length of email must be 3 characters"],
        maxLength: [50, "Length must be smaller than 50 characters"],
        lowercase: true,
        trim: true,
    },

    contact : {
        type : Number,
        required: true,
        minLength: [10, "Contact must be 10 characters long"],
        maxLength: [10, "Contact must be 10 characters long"],
    },

    password : {
        type : String,
        required: true
    },

    isAdmin : {
        type : String,
        required: true,
        default : false
    },

})


userSchema.methods.generateJWT = async function() {
    return jwt.sign({email: this.email}, process.env.JWT_SECRET, {expiresIn : '1d'});
}

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password);
}


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;