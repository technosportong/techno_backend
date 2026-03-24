const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items'
    }
  ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;