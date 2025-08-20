const express = require('express');
const bcrypt = require('bcryptjs');
// const mongodb = require('mongodb');

// const db = require('../data/database');
const Post = require('../models/Post');
const postController = require('../controllers/PostController');

// const ObjectId = mongodb.ObjectId;
const router = express.Router();

router.get('/', postController.getHome);
router.get('/admin', postController.getAdminPage);
router.post('/posts', postController.createPost);
router.get('/posts/:id/edit', postController.getPostById);
router.post('/posts/:id/edit', postController.updatePost);
router.post('/posts/:id/delete', postController.deletePost);

module.exports = router;
