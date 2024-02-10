
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

//Route to login user
router.post('/users/login', loginController.loginUser);

module.exports = router;