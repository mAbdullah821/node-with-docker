const express = require('express');
const {
  createPost,
  findOnePost,
  findAllPosts,
  editPost,
  deletePost,
} = require('../controllers/post');
const router = express.Router();

router.route('/').get(findAllPosts).post(createPost);
router.route('/:id').get(findOnePost).patch(editPost).delete(deletePost);

module.exports = router;
