const User = require("../Models/user.model");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");

const home = async(req, res) => {

    try {
        res.status(200).send("Server is live");
    } catch (error) {
        console.log(error);
    }
};


//Register the user

const register = async(req, res) => {

    try {

        // Express validator code
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //Get details from the form
        const {username, email, contact, password} = req.body;

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({
                error : "User already Exists",
            })
        }

        // Hash the password
        const hash_password = await bcrypt.hash(password, 10);

        const userCreated = await User.create({
            username, 
            email, 
            contact, 
            password : hash_password,
        })

        //Genearate token
        const token = await userCreated.generateJWT();


        console.log(req.body);
        return res.status(200).json({userCreated, token, user_id : userCreated._id.toString()});

    } catch (error) {
        console.log(error);
    }

}



//Login the user
const Login = async(req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;

        //user exist or not
        const userExists = await User.findOne({email});
        if(!userExists){
            return res.status(400).json({message : "Invalid credentials"});
        }


        //Password correct or not
        const isValidPass = await userExists.comparePassword(password);
        if(!isValidPass){
            return res.status(401).json({msg : "Invalid credentials"});            
        }


        //If all credentials are correct
        const token = await userExists.generateJWT();

        res.status(200).json({
            msg : "Login successful",
            user : userExists,
            token
        })
     

    } catch (error) {
        console.log(error);
    }
}

const blacklist = new Set();
// Logout User
const Logout = (req, res) => {
   
    const token = req.headers.authorization?.split(" ")[1];
    if (token) blacklist.add(token);
    res.json({ message: "Logged out successfully" });
    
}


module.exports = { home, Login, register, Logout };
