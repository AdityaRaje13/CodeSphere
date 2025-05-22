const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/auth.middleware");

const profileController = require("../Controllers/profile.controller");



router.get('/profile', authMiddleware.authUser , profileController.profile);

router.get('/profile-details', authMiddleware.authUser, profileController.getProfileDetails)


module.exports = router;