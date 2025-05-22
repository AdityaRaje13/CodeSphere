const express = require("express");
const router = express.Router();

const {body} = require("express-validator");
const projectController = require("../Controllers/project.controller");
const { authUser } = require("../Middleware/auth.middleware");


//Create project
router.post('/create',
    [
        body('name').notEmpty().isString().withMessage("Project name must require"),
        authUser,
    ],
    projectController.project
)


//Fetch all project
router.get('/allprojects', authUser, projectController.allProjects);


// Fetch projects seperately individual or collabed
router.get('/seperate-project', authUser, projectController.seperateProjects);


//Fetch all users
router.get("/all-users",authUser, projectController.allUsers);


//Add user
router.post('/add-user', projectController.addUsers);


//Fetch user details
router.post('/user-details', projectController.fetchUserDetails);


// router.post('/update-fileTree', projectController.setFileTree);


module.exports = router;