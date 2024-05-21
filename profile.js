const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userEmail: { type: String, required: true, unique: true },
  location: String,
  interests: String,
  availability: String
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
