const jwt = require("jsonwebtoken");


// Authenticate the user
const authUser = async (req, res, next) => {

    try {

        // Get the token 
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];


        // Check token is available or not
        if(!token){
            res.status(401).json({error : "Please authenticate"});
        }


        // Verify the token using 
        const userData = jwt.verify(token, process.env.JWT_SECRET);

        
        // Set the userData inti req.user
        req.user = userData;

        next();
        
    } catch (error) {

        res.status(401).send({error : "Unauthorized user"});
    }
}



module.exports = {authUser, };