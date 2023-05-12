const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, 'Post must have a title'],
  },
  body: {
    type: String,
    require: [true, 'Post must have a body'],
  },
});

const post = mongoose.model('post', postSchema);
module.exports = post;
