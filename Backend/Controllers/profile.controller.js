const userModel = require("../Models/user.model");


const profile = async(req, res) => {

    console.log(req.user);
    
    res.status(200).json({user : req.user});
}


const getProfileDetails = async (req, res) => {

    try {

        const userMail = req.user.email;

        const user = await userModel.findOne({email : userMail});

        return res.status(200).json(user);
        
    } 
    catch (error) {

        return res.status(400).send(error);
    }

}


module.exports = {profile, getProfileDetails, };