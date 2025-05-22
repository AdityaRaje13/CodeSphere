const express = require('express');
const aiController = require("../Controllers/ai.controller");

const router = express.Router();


// Get the response from ai

router.post('/get-result', aiController.generateResult );



module.exports = router;