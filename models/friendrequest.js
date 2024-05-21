const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  requester: { type: String, required: true }, // Ovdje koristite String za email
  recipient: { type: String, required: true }, // Ovdje koristite String za email
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
});

module.exports = mongoose.model('FriendRequest', friendRequestSchema);
