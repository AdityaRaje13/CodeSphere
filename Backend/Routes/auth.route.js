const express = require("express");
const authController = require("../Controllers/auth.controller");
const {body} = require("express-validator");
const authMiddleware = require("../Middleware/auth.middleware");


const router = express.Router();

// Home page
router.get('/',authController.home);


// Login route
router.post('/login',
    [
        body('email').isEmail().withMessage("Email must be valid email address"),
        body('password').isLength({min : 5}).withMessage("Password must contain 5 chracters"),
    ],
authController.Login);


// Register user route
router.post('/register', 
    [
        body('username').isLength({min : 3}).withMessage("Username must contain 3 characters"),
        body('contact').isNumeric().isLength({max: 10, min: 10}).withMessage("Contact must contain numbers and 10 chracters long"),
        body('email').isEmail().withMessage("Email must be valid email address"),
        body('password').isLength({min : 5}).withMessage("Password must contain 5 chracters"),
    ],
authController.register);


router.post('/logout', authController.Logout);


module.exports = router;