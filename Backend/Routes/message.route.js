const express = require("express");
const router = express.Router();

const messageController = require("../Controllers/message.controller");
const {body} = require("express-validator");



router.post("/contact", 
    [
        body('email').isEmail().withMessage("Email must with valid email adress"),
        body('contact').isNumeric().isLength({max:10, min:10}).withMessage("Contact must be numeric with 10 characters only"),
    ],
    messageController.message);

module.exports = router;