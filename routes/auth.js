const express = require('express');
// const bcrypt = require('bcryptjs');
// const mongodb = require('mongodb');

const authController = require('../controllers/AuthController');
// const db = require('../data/database');

// const ObjectId = mongodb.ObjectId;
const router = express.Router();

router.get('/signup', authController.getSignUpPage);
router.get('/login', authController.getLoginPage);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/401', authController.get401Page);

module.exports = router;
