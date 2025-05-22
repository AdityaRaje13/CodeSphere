const projectModel = require("../Models/project.model");
const {validationResult} = require("express-validator");
const userModel = require("../Models/user.model");

// Code to create new project
const project = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        // Get name from form
        const {name} = req.body;

        // Get email from token
        const userMail = req.user.email;
        
        //fetch userdetails using email
        const userDetails = await userModel.findOne({email : userMail});
        
        const userId = userDetails._id;

        //create new project
        const newProject = await projectModel.create({
            name, 
            users : userId,
            fileTree : {},
        })

        res.status(201).json({newProject});
        
    } 
    catch (error) {
        res.status(400).json({msg : error});
        console.log(error);
    }

}


// Fetch all projects
const allProjects = async(req, res) => {

    try {
        
        // Get mail from token
        const userMail = req.user.email;


        // fetch user details
        const userDetails = await userModel.findOne({email : userMail});
        const userId = userDetails._id;


        // Find project using userid
        const Projects = await projectModel.find({
            users : userId,
        })

        if(Projects.length === 0) {
            return res.status(404).json({error : "This user does not belong to any project"});
        }

        return res.status(200).json({Projects});

    } catch (error) {
        res.status(400).json({error});
    }

}


// Get all users 
const allUsers = async(req, res) => {

    try {

        // Get mail from token
        const userMail = req.user.email;


        // fetch user details
        const userDetails = await userModel.findOne({email : userMail});
        const userId = userDetails._id;


        // Get all user except logged in user
        const users = await userModel.find({_id : {$ne: userId}});

        if(!users){
            return res.status(200).json({msg : "No users found"});
        }

        return res.status(200).json({users});
        
    } catch (error) {
        return res.status(400).json({msg : error});
    }
}


// Add user to the project
const addUsers = async(req, res) => {

    try {

        // Get details from body
        const {projectId, userId} = req.body;

        const checkUser = await projectModel.findOne({
            _id: projectId,
            users: { $elemMatch: { $eq: userId } } // Check if userId exists in the array
        });

        if (checkUser) {
            return res.status(400).send( "User is already in the project");
        }
        

        // Add the user by updating the users array
        const updatedProject  = await projectModel.findOneAndUpdate( { _id: projectId }, { $push: { users: userId } }  );

        return res.status(200).json({updatedProject });
        
    } catch (error) {
        return res.status(400).json({msg : error});
    }
}



// Fetch the user details
const fetchUserDetails = async(req, res) => {

    try {

        const { userId } = req.body;

        const details = await userModel.findOne({_id : userId});

        return res.status(200).json({details});
        
    } catch (error) {
        return res.status(404).json({error});
    }
}



const seperateProjects = async(req, res) => {

    try {

        const userMail = req.user.email;

        const userData = await userModel.findOne({email : userMail});
        const userId = userData._id;

        // Individual Projects 
        const ownProjects = await projectModel.find({
            "users.0": userId.toString(),
        })


        // Projects in Collaboration
        const collabProjects = await projectModel.find({
            users: userId,             
            "users.0": { $ne: userId }
        })

        return res.status(200).json({ownProjects, collabProjects});
        
    } 
    catch (error) {
        return res.status(200).send(error);
    }
}


// const setFileTree = async(req, res) => {

//     try {

//         const { projectId, fileTree } = req.body;

//         await projectModel.findByIdAndUpdate(projectId, { fileTree }, { new: true });

//         return res.status(200).json(fileTree);
        
//     } 
//     catch (error) {
//         console.log(error);
//     }
// }


module.exports = {project, allProjects, allUsers, addUsers, fetchUserDetails, seperateProjects,  }

