const express = require('express')
const authController = require('./../Controller/AuthController')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
module.exports = router;