const mongoose = require('mongoose');

const ConnectedAccountSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
  },
  oauthId: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
});

const UserSchema = new mongoose.Schema({
  oauthId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  connectedAccounts: {
    type: [ConnectedAccountSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
