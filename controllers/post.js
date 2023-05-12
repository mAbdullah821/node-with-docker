const Post = require('../models/post');
const mongoose = require('mongoose');

const findAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.send({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(403).send({ status: 'fail' });
  }
};

const findOnePost = async (req, res, next) => {
  try {
    const post = await Post.find({
      _id: req.params.id, //mongoose.types.ObjectId(req.params.id),
    });
    res.send({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(403).send({ status: 'fail' });
  }
};

const editPost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.send({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(403).send({ status: 'fail' });
  }
};

const deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.send({
      status: 'success',
    });
  } catch (err) {
    res.status(403).send({ status: 'fail' });
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.send({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(403).send({ status: 'fail' });
  }
};

module.exports = {
  createPost,
  findOnePost,
  findAllPosts,
  editPost,
  deletePost,
};
