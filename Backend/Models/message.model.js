const mongoose = require("mongoose");


const msgSchema = new mongoose.Schema({

    email :{
        minLength: [6, "Must contain 6 chracters"],
        type : String, 
        required : true
    },

    contact : {
        type: Number,
        required: true,
        minLength: [10, "Must contain 10 chracters"],
        maxLength : [10, "Maximum 10 numbers are in contact"],
    },


    message: {
        required : true,
        type: String,
    }

})


const msgModel = mongoose.model('message', msgSchema);

module.exports = msgModel;