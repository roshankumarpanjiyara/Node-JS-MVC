const express = require('express');
const bcrypt = require('bcryptjs');
// const mongodb = require('mongodb');

// const db = require('../data/database');
const Post = require('../models/Post');
const postController = require('../controllers/PostController');
const protectRoute = require('../middleware/auth').protectRoute;

// const ObjectId = mongodb.ObjectId;
const router = express.Router();

router.get('/', postController.getHome);
router.use(protectRoute);//after this line, all routes will require authentication
// If you want to protect only specific routes, you can apply protectRoute middleware to those routes
// router.get('/admin',protectRoute, postController.getAdminPage);  <- example of protecting a specific route
router.get('/admin', postController.getAdminPage);
router.post('/posts', postController.createPost);
router.get('/posts/:id/edit', postController.getPostById);
router.post('/posts/:id/edit', postController.updatePost);
router.post('/posts/:id/delete', postController.deletePost);

module.exports = router;
