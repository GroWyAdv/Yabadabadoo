const mongoose = require('mongoose');

const requiredString = {
  type: String,
  required: true
};

const settingsSchema = new mongoose.Schema({
  _id: requiredString,
  welcomeMessages: requiredString,
  leaveMessages: requiredString,
  modMessages: requiredString,
});

module.exports = mongoose.model('guilds-settings', settingsSchema);