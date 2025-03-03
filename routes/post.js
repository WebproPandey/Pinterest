const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true
  },
  Image:{
  type: String,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: {
    type:Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports= mongoose.model('Post', postSchema);


