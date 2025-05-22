const msgModel = require("../Models/message.model");
const {validationResult} = require("express-validator");


const message = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {email, contact, message} = req.body;
        
        const newMessage = await msgModel.create({
            email,
            contact,
            message,
        })

        return res.status(201).json({newMessage});
        
    } catch (error) {
        console.log(error);
    }

}



module.exports = {message, };